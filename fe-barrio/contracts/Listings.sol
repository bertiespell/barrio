// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";
import "./AccessControl.sol";

/// @title Listings manages buying and selling of listed items
contract Listings is AccessControl, KeeperCompatible {
    /// @dev used to store information about a Listing
    struct Listing {
        address payable sellerAddress;
        mapping(address => bool) buyerAddresses;
        address payable[] buyerAddressesArray;
        uint256 price;
        uint256 date;
        bool bought;
    }

    /// @dev stores all of the submitted Listings
    mapping(string => Listing) public listings;
    /// @dev Also store listings hash as an array in order to loop over later during upkeep
    string[] public listingsArray;

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

    uint256 public lastTimeStamp;
    uint256 public interval = 604800;

    constructor() {
        lastTimeStamp = block.timestamp;
    }

    /// @dev Change the interval used for wiping data
    function setInterval(uint256 newInterval) public whenNotPaused onlyCLevel {
        interval = newInterval;
    }

    /// @dev List an item for sale, where the metadata is stored in IPFS
    function createListing(string memory ipfsHash, uint256 price)
        public
        payable
        whenNotPaused
    {
        require(listings[ipfsHash].sellerAddress == address(0x0));

        listings[ipfsHash].sellerAddress = payable(msg.sender);
        listings[ipfsHash].price = price;
        listings[ipfsHash].date = block.timestamp;

        listingsArray.push(ipfsHash);

        emit ListingSubmitted(msg.sender, ipfsHash, price);
    }

    /// @dev Make an offer to buy a listing
    function makeOffer(string memory ipfsHash) public payable whenNotPaused {
        require(listings[ipfsHash].sellerAddress != msg.sender);
        require(listings[ipfsHash].bought == false);
        require(listings[ipfsHash].buyerAddresses[msg.sender] != true);
        require(listings[ipfsHash].price <= msg.value);
        listings[ipfsHash].buyerAddresses[msg.sender] = true;
        listings[ipfsHash].buyerAddressesArray.push(payable(msg.sender));

        emit OfferMade(msg.sender, ipfsHash);
    }

    /// @dev Confirm a buy has taken place and transfer funds
    function confirmBuy(string memory ipfsHash) public whenNotPaused {
        require(listings[ipfsHash].buyerAddresses[msg.sender] == true);
        require(listings[ipfsHash].bought == false);

        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            if (listings[ipfsHash].buyerAddressesArray[i] != msg.sender) {
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

        listings[ipfsHash].bought = true;
    }

    /// @dev Called during performUpkeep to empty unused funds
    function removeListing(string memory ipfsHash) private {
        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            listings[ipfsHash].buyerAddressesArray[i].transfer(
                listings[ipfsHash].price
            );
        }

        listings[ipfsHash].bought = true;
    }

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
        for (uint256 i = 0; i < listingsArray.length; i++) {
            if (checkDateIsOlderThanInterval(listings[listingsArray[i]].date)) {
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

    function performUpkeep(bytes calldata performData) external override {
        string[] memory decodedValue = abi.decode(performData, (string[]));

        for (uint256 i = 0; i < decodedValue.length; i++) {
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

    function getListingsArray() public view returns (string[] memory) {
        string[] memory allListings = new string[](listingsArray.length);
        for (uint256 i = 0; i < listingsArray.length; i++) {
            allListings[i] = listingsArray[i];
        }
        return allListings;
    }

    function getBuyersForListing(string memory ipfsHash)
        public
        view
        returns (address[] memory)
    {
        require(listings[ipfsHash].sellerAddress != address(0x0));

        address[] memory buyerAddresses = new address[](
            listings[ipfsHash].buyerAddressesArray.length
        );
        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            buyerAddresses[i] = listings[ipfsHash].buyerAddressesArray[i];
        }
        return buyerAddresses;
    }

    function getPriceForListing(string memory ipfsHash)
        public
        view
        returns (uint256)
    {
        require(listings[ipfsHash].sellerAddress != address(0x0));

        uint256 price = listings[ipfsHash].price;
        return price;
    }

    function getSellerForListing(string memory ipfsHash)
        public
        view
        returns (address)
    {
        require(listings[ipfsHash].sellerAddress != address(0x0));

        address sellerAddress = listings[ipfsHash].sellerAddress;
        return sellerAddress;
    }

    function getBoughtForListing(string memory ipfsHash)
        public
        view
        returns (bool)
    {
        require(listings[ipfsHash].sellerAddress != address(0x0));

        bool bought = listings[ipfsHash].bought;
        return bought;
    }

    /// @dev this method calls selfdestruct() and removes the contract from the blockchain.
    function kill() public onlyCEO whenNotPaused {
        selfdestruct(ceoAddress);
    }
}
