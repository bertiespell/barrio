require("dotenv").config();

const fs = require("fs");
const Web3 = require("web3");

const { abi, bytecode } = JSON.parse(
	fs.readFileSync(
		"/Users/berniesnell/Blockchain/barrio/fe-barrio/build/contracts/Listings.json"
	)
);

async function main() {
	const setInterval = async (interval) => {
		const setIntervalData = listings.methods
			.setInterval(interval)
			.encodeABI();

		const tx = await web3.eth.sendTransaction(
			{
				from: signer.address,
				to: address,
				gas: 30000000,
				data: setIntervalData,
			},
			function (err, res) {
				if (err) console.log(err, "ERR:setInterval");
				if (res) console.log(res, "RES:setInterval");
			}
		);
		console.log(tx, "TX:setInterval");
	};

	const createListing = async (ipfsHash, price) => {
		const createListing = listings.methods
			.createListing(ipfsHash, price)
			.encodeABI();

		const tx = await web3.eth.sendTransaction(
			{
				from: signer.address,
				to: address,
				gas: 30000000,
				data: createListing,
			},
			function (err, res) {
				if (err) console.log(err, "ERR:createListing");
				if (res) console.log(res, "RES:createListing");
			}
		);
		console.log(tx, "TX:createListing");
	};

	const network = process.env.ETHEREUM_NETWORK;

	// Set up web3 object, connected to the local development network
	const web3 = new Web3(
		new Web3.providers.HttpProvider(
			`https://${network}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
		)
	);

	// Creating a signing account from a private key
	const signer = web3.eth.accounts.privateKeyToAccount(
		process.env.SIGNER_PRIVATE_KEY
	);
	web3.eth.accounts.wallet.add(signer);

	const address = process.env.LISTINGS_CONTRACT;
	const listings = new web3.eth.Contract(abi, address);

	// uncomment to use these methods on the smart contract
	// await setInterval(604800);
	// await createListing("QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps", 1);
}

main();
