import axios from "axios";

export const getListing = async (listingCID) => {
	const data = await axios({
		method: "get",
		url: "http://localhost:3001/ipfs/" + listingCID,
	});

	console.log(data);
};

export const getAllListings = async () => {
	const data = await axios({
		method: "get",
		url: "http://localhost:3001/ipfs/",
	});

	console.log(data);
};

export const createListing = async (listing) => {
	var formData = new FormData();
	formData.append("listings", listing.selectedFile);

	formData.append("title", listing.title);
	formData.append("price", listing.price);
	formData.append("description", listing.description);

	const data = await axios.post("http://localhost:3001/ipfs/", formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});

	console.log(data, "Response");
};
