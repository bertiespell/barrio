// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "../contracts/AccessControl.sol";
import "./Listings.sol";

contract Ratings is AccessControl {
    mapping(address => uint256[]) public sellerRatings;
    mapping(address => uint256[]) public buyerRatings;

    mapping(string => bool) public ratedSellerListings;
    mapping(string => bool) public ratedBuyerListings;

    Listings public listingsContract;

    event SellerRatingsUpdated(uint256[] ratings, address seller);
    event BuyerRatingsUpdated(uint256[] ratings, address buyer);

    event RatingRecieved(uint256 rating);

    constructor(address _listingsContract) {
        listingsContract = Listings(_listingsContract);
    }

    function leaveSellerRating(string memory ipfsHash, uint256 rating)
        public
        returns (uint256[] memory)
    {
        (
            address payable sellerAddress,
            ,
            address finalBuyer,
            ,
            ,
            ,
            bool bought,
            ,
            address payable useThirdPartyAddress
        ) = listingsContract.listings(ipfsHash);

        require(sellerAddress != address(0x0), "This listing does not exist");
        require(
            bought == true,
            "You can only leave a rating on a finalized purchase"
        );
        require(
            finalBuyer == msg.sender,
            "A different final buyer exists for this listing"
        );
        require(
            ratedSellerListings[ipfsHash] == false,
            "A rating has already been left for the seller of this listing"
        );
        require(rating >= 0, "Can't send a negative rating");
        require(rating <= 5, "You can only rate up to 5");

        emit RatingRecieved(rating);

        ratedSellerListings[ipfsHash] = true;

        // if they used a third party, the reviews go to them
        if (useThirdPartyAddress != address(0x0)) {
            sellerRatings[useThirdPartyAddress].push(rating);
            uint256[] memory ratings = new uint256[](
                sellerRatings[useThirdPartyAddress].length
            );
            for (
                uint256 i = 0;
                i < sellerRatings[useThirdPartyAddress].length;
                i++
            ) {
                ratings[i] = sellerRatings[useThirdPartyAddress][i];
            }
            emit SellerRatingsUpdated(ratings, useThirdPartyAddress);
            return ratings;
        } else {
            sellerRatings[sellerAddress].push(rating);
            uint256[] memory ratings = new uint256[](
                sellerRatings[sellerAddress].length
            );
            for (uint256 i = 0; i < sellerRatings[sellerAddress].length; i++) {
                ratings[i] = sellerRatings[sellerAddress][i];
            }
            emit SellerRatingsUpdated(ratings, sellerAddress);

            return ratings;
        }
    }

    function leaveBuyerRating(string memory ipfsHash, uint256 rating)
        public
        returns (uint256[] memory)
    {
        (
            address payable sellerAddress,
            ,
            address finalBuyer,
            ,
            ,
            ,
            bool bought,
            ,

        ) = listingsContract.listings(ipfsHash);

        require(sellerAddress != address(0x0), "This listing does not exist");
        require(
            bought == true,
            "You can only leave a rating on a finalized purchase"
        );
        require(
            sellerAddress == msg.sender,
            "Only the seller of a listing can review the buyer"
        );
        require(
            ratedBuyerListings[ipfsHash] == false,
            "A rating has already been left for the buyer of this listing"
        );
        require(rating >= 0, "Can't send a negative rating");
        require(rating <= 5, "You can only rate up to 5");

        buyerRatings[finalBuyer].push(rating);

        uint256[] memory ratings = new uint256[](
            buyerRatings[finalBuyer].length
        );
        for (uint256 i = 0; i < buyerRatings[finalBuyer].length; i++) {
            ratings[i] = buyerRatings[finalBuyer][i];
        }
        emit BuyerRatingsUpdated(ratings, finalBuyer);
        ratedBuyerListings[ipfsHash] = true;

        return ratings;
    }

    function sellerRatingAvailable(string memory ipfsHash)
        public
        view
        returns (bool)
    {
        (, , , , , , bool bought, , ) = listingsContract.listings(ipfsHash);

        return !ratedSellerListings[ipfsHash] && bought;
    }

    function buyerRatingAvailable(string memory ipfsHash)
        public
        view
        returns (bool)
    {
        (, , , , , , bool bought, , ) = listingsContract.listings(ipfsHash);

        return !ratedBuyerListings[ipfsHash] && bought;
    }

    function getSellerRatings(address seller)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory ratings = new uint256[](sellerRatings[seller].length);
        for (uint256 i = 0; i < sellerRatings[seller].length; i++) {
            ratings[i] = sellerRatings[seller][i];
        }
        return ratings;
    }

    function getBuyerRatings(address seller)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory ratings = new uint256[](buyerRatings[seller].length);
        for (uint256 i = 0; i < buyerRatings[seller].length; i++) {
            ratings[i] = buyerRatings[seller][i];
        }
        return ratings;
    }
}
