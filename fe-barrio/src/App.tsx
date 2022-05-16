import React, { useState } from "react";
import "./App.css";
// @ts-ignore
import { createListing, OrbitListing, getListing } from "./getData.tsx";
// @ts-ignore
import web3Connection from "./getWeb3.tsx";

function App() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [price, setPrice] = useState("0");
	const [selectedFile, setSelectedFile] = useState();

	const submitForm = async (event) => {
		event.preventDefault();

		// we add the data into ipfs to retrieve a hash for the files
		const listing: OrbitListing = await createListing({
			title,
			description,
			price,
			selectedFile,
			location,
		});

		// send the ipfs has to smart contract
		await web3Connection.createListing(listing.imageFilesCID);
	};

	return (
		<div className="App">
			<header className="App-header">
				<form>
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>

					<input
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>

					<input
						type="text"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>

					<input
						type="text"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>

					<input
						type="file"
						onChange={(e) =>
							setSelectedFile(e.target.files[0] as any)
						}
					/>
					<div>
						<button onClick={(e) => submitForm(e)}>Submit</button>
					</div>
				</form>
				<button onClick={(e) => web3Connection.getAccounts()}>
					Enable Ethereum
				</button>
				<button onClick={(e) => web3Connection.getAllListings()}>
					Get Listing Data
				</button>
				<button
					onClick={(e) =>
						web3Connection.getListingData(
							"bafybeiddkz4iaslgtos4t74sbf4hmcler7gkiqpzyygb35jxv6rsynp5zq"
						)
					}
				>
					Get Specific Listing
				</button>
				<button
					onClick={(e) =>
						web3Connection.makeOffer(
							"bafybeiddkz4iaslgtos4t74sbf4hmcler7gkiqpzyygb35jxv6rsynp5zq"
						)
					}
				>
					Make Offer
				</button>
				<button
					onClick={(e) =>
						web3Connection.confirmBuy(
							"bafybeiddkz4iaslgtos4t74sbf4hmcler7gkiqpzyygb35jxv6rsynp5zq"
						)
					}
				>
					Confirm Offer
				</button>
			</header>
		</div>
	);
}

export default App;
