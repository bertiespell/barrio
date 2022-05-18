import React, { useEffect, useState } from "react";
import { CardListing } from "../pages/listings";
import { makeGatewayURL } from "../utils/getIpfs";
import { getAllListings } from "../utils/getOrbitData";
import getWeb3 from "../utils/getWeb3";

export const ListingsContext = React.createContext({});

const ListingsProvider = ({ children }: any) => {
	const [listings, setListings] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);

	const validateProduct = (listing: any) => {
		if (!listing.imageFilesCID) return false;
		if (!listing.title) return false;
		if (!listing.price) return false;
		if (!listing.description) return false;
		if (!listing.fileNames) return false;
		if (!listing.user) return false;
		// if (!listing.date) return false;

		return true;
	};

	const getOffers = async (mappedData: any) => {
		return Promise.all(
			mappedData.map(async (listing: CardListing) => {
				try {
					const ethData = await getWeb3.getListingData(listing.id);
					const offersMade = ethData["buyers"].map((buyer) => {
						return {
							user: buyer,
							price: ethData.price,
						};
					});
					const bought = ethData.bought;
					return {
						...listing,
						offersMade,
						bought,
					};
				} catch (e) {
					console.warn(e);
				}
			})
		);
	};

	const getAllProducts = async () => {
		try {
			setLoading(true);
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
							// date: listing.date,
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

			const withOffers = await getOffers(mappedData);
			setListings(withOffers);
			setLoading(false);
		} catch (err) {}
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
			{loading ? <p>loading</p> : children}
		</ListingsContext.Provider>
	);
};

export default ListingsProvider;
