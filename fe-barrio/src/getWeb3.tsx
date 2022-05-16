import Listings from "./abi/Listings.json"; //truffle project dir
import web3 from "web3";
import { BigNumber, ethers } from "ethers";

// Uses a singleton pattern to construct, load and get database
class Web3Connection {
	provider;
	currentAccount;

	constructor() {
		// Create a singleton for DB creation
		if ((Web3Connection as any)._instance) {
			return (Web3Connection as any)._instance;
		}
		(Web3Connection as any)._instance = this;

		this.provider = new ethers.providers.Web3Provider(
			(window as any).ethereum
		);
	}

	async getAccounts() {
		try {
			const accounts = await this.provider.send(
				"eth_requestAccounts",
				[]
			);

			this.currentAccount = accounts[0];

			console.log("(SM) ETH enabled with account: ", this.currentAccount);
			return this.currentAccount;
		} catch (err) {
			console.log(err, "err");
		}
	}

	async createListing(listing: string) {
		const listingContract = new ethers.Contract(
			process.env.REACT_APP_NOT_SECRET_CODE_UPDATED_LISTINGS_CONTRACT,
			Listings.abi,
			this.provider
		);

		const listingWithSigner = listingContract.connect(
			this.provider.getSigner()
		);

		try {
			const createdListing = await listingWithSigner.createListing(
				listing,
				ethers.utils.parseEther("0.001")
			);
			console.log("(SM) Listing created: ", createdListing);
			return createdListing;
		} catch (err) {
			console.log(err);
		}
	}

	async getAllListings(): Promise<string[]> {
		const listingContract = new ethers.Contract(
			process.env.REACT_APP_NOT_SECRET_CODE_UPDATED_LISTINGS_CONTRACT,
			Listings.abi,
			this.provider
		);

		const allListings = await listingContract.getListingsArray();
		console.log("(SM) All listings retrieved: ", allListings);
		return allListings;
	}

	async getListingData(listing: string): Promise<{
		buyers: string[];
		price: string;
		seller: string;
	}> {
		const listingContract = new ethers.Contract(
			process.env.REACT_APP_NOT_SECRET_CODE_UPDATED_LISTINGS_CONTRACT,
			Listings.abi,
			this.provider
		);

		const buyers = await listingContract.getBuyersForListing(listing);
		const price = await listingContract.getPriceForListing(listing);
		const seller = await listingContract.getSellerForListing(listing);

		console.log(`(SM) Retrieving ${listing} data from smart contract: `, {
			buyers,
			price,
			seller,
		});
		return {
			buyers,
			price,
			seller,
		};
	}

	async makeOffer(listing) {
		const listingContract = new ethers.Contract(
			process.env.REACT_APP_NOT_SECRET_CODE_UPDATED_LISTINGS_CONTRACT,
			Listings.abi,
			this.provider
		);

		const listingWithSigner = listingContract.connect(
			this.provider.getSigner()
		);

		try {
			// Ether amount to send
			const price = await listingContract.getPriceForListing(listing);
			console.log(BigNumber.from(price));

			const offer = await listingWithSigner.makeOffer(listing, {
				value: BigNumber.from(price),
			});
			console.log("(SM) Offer made: ", offer);
			return offer;
		} catch (err) {
			console.log(err);
		}
	}

	async confirmBuy(listing) {
		const listingContract = new ethers.Contract(
			process.env.REACT_APP_NOT_SECRET_CODE_UPDATED_LISTINGS_CONTRACT,
			Listings.abi,
			this.provider
		);

		const listingWithSigner = listingContract.connect(
			this.provider.getSigner()
		);

		try {
			const confirmedBuy = await listingWithSigner.confirmBuy(listing);
			console.log("(SM) Buy is confirmed: ", confirmedBuy);
			return confirmedBuy;
		} catch (err) {
			console.log(err);
		}
	}
}
export default new Web3Connection();
