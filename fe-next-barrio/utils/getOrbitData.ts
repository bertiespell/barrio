import axios from "axios";

export const getListing = async (listingCID: string) => {
	try {
		const listingData = await axios({
			method: "get",
			url: "http://localhost:3001/ipfs/" + listingCID,
		});
		console.log("(OrbitDB) listing data: ", listingData);
		return listingData;
	} catch (err) {
		console.error("Couldn't getListing data from orbit: ", err);
	}
};

export const getAllListings = async () => {
	try {
		const listingData = await axios({
			method: "get",
			url: "http://localhost:3001/ipfs/",
		});
		console.log("(OrbitDB) all listing data: ", listingData);
		return listingData;
	} catch (err) {
		console.error("Couldn't getAllListing data from orbit: ", err);
	}
};

export type IpfsHash = String;
export type OrbitId = String;

export type Listing = {
	price: String;
	title: String;
	description: String;
	imageFilesCID: String;
	offersMade: String[];
};

export type OrbitListing = {
	status: Boolean;
	message: String;
	orbitID: OrbitId;
	imageFilesCID: IpfsHash;
	data: Listing;
};

export type ListingFormData = {
	selectedFile: string;
	title: string;
	description: string;
	price: string;
	location: string;
}

export const createListing = async (listing: ListingFormData): Promise<OrbitListing | Error> => {
	var formData = new FormData();
	formData.append("listings", listing.selectedFile);
	formData.append("title", listing.title);
	formData.append("price", listing.price);
	formData.append("description", listing.description);
	formData.append("location", listing.location);

	try {
		const orbitData = await axios.post(
			"http://localhost:3001/ipfs/",
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		console.log("(OrbitDB) listing created: ", orbitData);

		return orbitData.data;
	} catch (err) {
		console.error(err);
		return Error("Couldn't save data to orbit");
	}
};
