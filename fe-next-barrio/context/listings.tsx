import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { CardListing } from "../pages/listings";
import { makeGatewayURL } from "../utils/getIpfs";
import { getAllListings } from "../utils/getOrbitData";
import getWeb3 from "../utils/getWeb3";

export const ListingsContext = React.createContext({});

const ListingsProvider = ({ children }: any) => {
	const [listings, setListings] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);

	const validateProduct = (listing: any) => {
		if (!listing.imageFilesCID) return false;
		if (!listing.title) return false;
		if (!listing.price) return false;
		if (!listing.description) return false;
		if (!listing.fileNames) return false;
		if (!listing.user) return false;

		return true;
	};

	const getSmartContractData = async (mappedData: any) => {
		return Promise.all(
			mappedData.map(async (listing: CardListing) => {
				try {
					const ethData = await getWeb3.getListingData(listing.id);
					const canBeReviewed = await getWeb3.sellerCanBeReviewed(
						listing.id
					);

					const isAuction = ethData.isAuction;
					let offersMade = [];
					if (!isAuction) {
						offersMade = ethData["buyers"].map((buyer) => {
							return {
								buyer,
								price: ethData.price,
							};
						});
					} else {
						offersMade = ethData.auctionData?.offers;
					}
					const bought = ethData.bought;
					const timestamp = ethData.timestamp;
					const auctionData = ethData.auctionData;
					const useThirdPartyAddress = ethData.useThirdPartyAddress;
					return {
						...listing,
						offersMade,
						bought,
						isAuction,
						timestamp,
						auctionData,
						useThirdPartyAddress,
						canBeReviewed,
					};
				} catch (e) {
					console.warn(e);
					throw Error(
						"(SM) Unable to get data for these listings from the Smart Contract, check that the correct contract is deployed and set in env variables"
					);
				}
			})
		);
	};

	const getAllProducts = async () => {
		try {
			const allListings = await getAllListings();
			const mappedData = allListings.data
				.filter((listing: any) => validateProduct(listing))
				.map((listing: any) => {
					try {
						const newListings: CardListing = {
							id: listing.imageFilesCID,
							name: listing.title,
							description: listing.description,
							price: listing.price,
							images: listing.fileNames.map(
								(filename: string) => {
									return {
										src: makeGatewayURL(
											listing.imageFilesCID,
											filename
										),
										name: filename,
										id: filename,
									};
								}
							),
							date: "",
							user: listing.user,
							bought: false,
							offersMade: [],
							rating: -1,
							location: listing.location,
						};
						return newListings;
					} catch (e) {
						console.warn(`Failed to serialise data`, e, listing);
					}
				});

			try {
				const withOffers = await getSmartContractData(mappedData);

				setListings(withOffers);
				setLoading(false);
			} catch (err) {
				console.warn(
					"No smart contract data could be loaded, check configuration (may need to delete local orbit data as it doesn't match the ipfs hashes stored on the EVM"
				);
				setLoading(false);
			}
		} catch (err) {
			console.error(err, "Error getting all products");
		}
	};

	useEffect(() => {
		if (!listings.length) {
			getAllProducts();
		}
	}, []);

	return (
		<ListingsContext.Provider
			value={{
				listings,
				getAllProducts,
			}}
		>
			{loading ? (
				<div className="max-w-7xl mx-auto pt-20 pb-20 px-4 sm:px-6 lg:px-8">
					<div className="px-4 sm:px-6 lg:px-8">
						<LoadingSpinner />
					</div>
				</div>
			) : (
				children
			)}
		</ListingsContext.Provider>
	);
};

export default ListingsProvider;
