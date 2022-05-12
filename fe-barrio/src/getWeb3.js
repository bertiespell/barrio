import Listings from "./abi/Listings.json"; //truffle project dir

// Uses a singleton pattern to construct, load and get database
class Web3Connection {
	ethereum;
	web3;
	currentAccount;

	constructor() {
		// Create a singleton for DB creation
		if (Web3Connection._instance) {
			return Web3Connection._instance;
		}
		Web3Connection._instance = this;
		if (typeof window.ethereum !== "undefined") {
			console.log("MetaMask is installed!");
			this.ethereum = window.ethereum;
			this.web3 = window.web3;
			console.log(this.web3, "web2");
			console.log(this.ethereum, "ethereum");
		}
	}

	async getAccounts() {
		console.log("getting accounts");
		try {
			const accounts = await this.ethereum.request({
				method: "eth_requestAccounts",
			});
			this.currentAccount = accounts[0];
		} catch (err) {
			console.log(err, "err");
		}
	}

	async sendTransaction() {
		console.log(this.web3, "web2");
		console.log(this.ethereum, "ethereum");
		const listingContract = new this.web3.eth.contract(
			Listings.abi,
			process.env.LISTINGS_CONTRACT
		);
		console.log(listingContract);

		// const data =
		// 	"0x7f7465737432000000000000000000000000000000000000000000000000000000600057";

		// const transactionParameters = {
		// 	nonce: "0x00", // ignored by MetaMask
		// 	gasPrice: "0x09184e72a000", // customizable by user during MetaMask confirmation.
		// 	gas: "0x2710", // customizable by user during MetaMask confirmation.
		// 	to: process.env.LISTINGS_CONTRACT, // Required except during contract publications.
		// 	from: this.ethereum.selectedAddress, // must match user's active address.
		// 	value: "0x00", // Only required to send ether to the recipient from the initiating external account.
		// 	data, // Optional, but used for defining smart contract creation and interaction.
		// 	chainId: "0x2a", // Kovan network
		// };

		// txHash is a hex string
		// As with any RPC call, it may throw an error
		// const txHash = await this.ethereum.request({
		// 	method: "eth_sendTransaction",
		// 	params: [transactionParameters],
		// });
		// console.log(txHash);
	}
}
export default new Web3Connection();
