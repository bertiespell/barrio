// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./AccessControl.sol";

/// @title Listings manages buying and selling of listed items
contract Listings is AccessControl, KeeperCompatible {
    /// @dev used to store information about a Listing
    struct Listing {
        address payable sellerAddress;
        // It's a bit redundant to store a bool here
        // But it's cheaper to use a mapping than an array for lookup
        mapping(address => bool) buyerAddresses;
        // We also store an array of addresses in order to loop over later and refund money
        // https://ethereum.stackexchange.com/questions/67597/how-do-i-loop-through-a-mapping-of-address
        address payable[] buyerAddressesArray;
        uint256 price;
        uint256 date;
    }

    // We can improve on gas costs by splitting the ipfs hash here and storing it cleverly:
    // https://ethereum.stackexchange.com/questions/17094/how-to-store-ipfs-hash-using-bytes32
    /// @dev stores all of the submitted Listings
    mapping(string => Listing) private listings;
    /// @dev Also store listings hash as an array in order to loop over later during upkeep
    string[] listingsArray;

    /// @dev emitted whenever a new listing is submitted
    event ListingSubmitted(
        address sellerAddress,
        string ipfsHash,
        uint256 price
    );

    /// @dev emitted whenever a new listing is submitted
    event Debug(uint256 date, string[] listingsArray, bool updateNeeded);

    /// @dev emitted whenever an offer is made from a seller
    event OfferMade(address buyerAddress, string ipfsHash);

    /// track the block timestamps in order to clear data on Chainlink
    uint256 public lastTimeStamp;
    // the time listings are kept for (two weeks)
    uint256 public interval = 604800;

    constructor() {
        lastTimeStamp = block.timestamp;
    }

    /// @dev Change the interval used for wiping data
    function setInterval(uint256 newInterval) public whenNotPaused onlyCLevel {
        interval = newInterval;
    }

    /// @dev List an item for sale, where the metadata is stored in IPFS
    // Maps a seller address to a price and IPFS data hash
    function createListing(string memory ipfsHash, uint256 price)
        public
        payable
        whenNotPaused
    {
        // Confirm the IPFS hash isn't already listed
        // To compare a `nil` value, the entire struct is initialised to 0 value
        // https://ethereum.stackexchange.com/questions/871/what-is-the-zero-empty-or-null-value-of-a-struct
        require(listings[ipfsHash].sellerAddress == address(0x0));

        listings[ipfsHash].sellerAddress = payable(msg.sender);
        listings[ipfsHash].price = price;
        listings[ipfsHash].date = block.timestamp;

        listingsArray.push(ipfsHash);

        emit ListingSubmitted(msg.sender, ipfsHash, price);
    }

    /// @dev Make an offer to buy a listing
    /// ETH is held in escrow until the transaction if confirmed by either the buyer
    /// Or, in the future, a trusted third party
    function makeOffer(string memory ipfsHash) public payable whenNotPaused {
        //  Confirm the seller isn't already in the list
        require(listings[ipfsHash].buyerAddresses[msg.sender] != true);

        // Check the buyer has enough
        require(listings[ipfsHash].price <= msg.value);
        /// Find the listing and add the seller
        listings[ipfsHash].buyerAddresses[msg.sender] = true;
        listings[ipfsHash].buyerAddressesArray.push(payable(msg.sender));

        emit OfferMade(msg.sender, ipfsHash);
    }

    /// @dev Confirm a buy has taken place and transfer funds
    function confirmBuy(string memory ipfsHash) public whenNotPaused {
        //  Confirm the seller is in the list
        require(listings[ipfsHash].buyerAddresses[msg.sender] == true);

        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            if (listings[ipfsHash].buyerAddressesArray[i] != msg.sender) {
                // Refund other buyers in escrow
                listings[ipfsHash].buyerAddressesArray[i].transfer(
                    listings[ipfsHash].price
                );
            } else {
                // Send funds to seller
                listings[ipfsHash].sellerAddress.transfer(
                    listings[ipfsHash].price
                );
            }
        }
    }

    /// @dev Called during performUpkeep to empty unused funds
    // I don't think there's a reentrancy problem with `confirmBuy` above,
    // but it's best to audit before mainnet deployment
    function removeListing(string memory ipfsHash)
        private
    /// this should be restricted to only the chainlink contract
    {
        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            // Refund buyers in escrow
            listings[ipfsHash].buyerAddressesArray[i].transfer(
                listings[ipfsHash].price
            );
        }
    }

    // This function contains the logic that runs off-chain during every block as an eth_call to determine if performUpkeep
    // should be executed on-chain. To reduce on-chain gas usage, attempt to do your gas intensive calculations off-chain
    // in checkUpkeep and pass the result to performUpkeep on-chain.
    // Because checkUpkeep is only off-chain in simulation it is best to treat this as a view function and not modify any state.
    // This might not always be possible if you want to use more advanced Solidity features like DelegateCall.
    // It is a best practice to import the KeeperCompatible.sol contract and use the cannotExecute modifier to ensure
    // that the method can be used only for simulation purposes.
    function checkUpkeep(
        bytes calldata /* checkData */
    )
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        string[] memory listingsToRemove = new string[](listingsArray.length);

        bool updateNeeded = false;
        // Loop through all the listings
        for (uint256 i = 0; i < listingsArray.length; i++) {
            // If a listing is over a week old, then return `true` with a list of the hashes to update
            if (checkDateIsOlderThanInterval(listings[listingsArray[i]].date)) {
                // Push it into listingsToRemove
                listingsToRemove[i] = listingsArray[i];
                updateNeeded = true;
            }
        }

        if (updateNeeded) {
            performData = abi.encode(listingsToRemove);
            return (true, performData);
        } else {
            string[] memory emptyListing;
            performData = abi.encode(emptyListing);
            return (false, performData);
        }
    }

    // When checkUpkeep returns upkeepNeeded == true, the Keeper node broadcasts a transaction to the blockchain
    // to execute your performUpkeep function on-chain with performData as an input.
    // Ensure that your performUpkeep is idempotent. Your performUpkeep function should change state such that checkUpkeep
    // will not return true for the same subset of work once said work is complete. Otherwise the Upkeep will remain eligible
    // and result in multiple performances by the Keeper Network on the exactly same subset of work. As a best practice, always
    // revalidate conditions for your Upkeep at the start of your performUpkeep function.
    function performUpkeep(bytes calldata performData) external override {
        // Convert data from bytes to string[] (listings to remove)
        string[] memory decodedValue = abi.decode(performData, (string[]));

        // Loop through all the listings
        for (uint256 i = 0; i < decodedValue.length; i++) {
            // Revalidate that the data is over seven days old
            if (checkDateIsOlderThanInterval(listings[decodedValue[i]].date)) {
                removeListing(decodedValue[i]);
            }
        }
    }

    /// @dev Ascertain whether a date is older than the interval (i.e. that it's two weeks old compared to current blocktime)
    function checkDateIsOlderThanInterval(uint256 date)
        private
        view
        returns (bool)
    {
        return date < block.timestamp - interval;
    }

    /// @dev this method calls selfdestruct() and removes the contract from the blockchain.
    /// Access is limited to the CEO.
    function kill() public onlyCEO whenNotPaused {
        selfdestruct(ceoAddress);
    }
}
