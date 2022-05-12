import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { createListing } from "./getData";
import web3Connection from "./getWeb3";

function App() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState(0);
	const [selectedFile, setSelectedFile] = useState();

	const submitForm = async (event) => {
		event.preventDefault();

		createListing({
			title,
			description,
			price,
			selectedFile,
		});
	};

	return (
		<div className="App">
			<header className="App-header">
				<form>
					<input
						type="Title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>

					<input
						type="Description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>

					<input
						type="Price"
						value={price}
						onChange={(e) => setPrice(e.target.value)}
					/>

					<input
						type="file"
						onChange={(e) => setSelectedFile(e.target.files[0])}
					/>
					<div>
						<button onClick={(e) => submitForm(e)}>Submit</button>
					</div>
				</form>
				<button onClick={(e) => web3Connection.getAccounts()}>
					Enable Ethereum
				</button>
				<button onClick={(e) => web3Connection.sendTransaction()}>
					Send ETH
				</button>
			</header>
		</div>
	);
}

export default App;
