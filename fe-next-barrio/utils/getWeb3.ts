import Listings from "../public/abi/Listings.json"; //truffle project dir
import { BigNumber, ethers } from "ethers";

const listingsContractAddress: string = (process.env.NEXT_PUBLIC_LISTINGS_CONTRACT_ADDRESS as string);

// Uses a singleton pattern to construct, load and get database
class Web3Connection {
	provider!: ethers.providers.Web3Provider;
	currentAccount!: string;

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

	async createListing(listing: string, price: string) {
		const listingContract = new ethers.Contract(
			listingsContractAddress,
			Listings.abi,
			this.provider
		);

		const listingWithSigner = listingContract.connect(
			this.provider.getSigner()
		);

		try {
			const createdListing = await listingWithSigner.createListing(
				listing,
				ethers.utils.parseEther(price)
			);
			console.log("(SM) Listing created: ", createdListing);
			return createdListing;
		} catch (err) {
			console.log(err);
		}
	}

	async getAllListings(): Promise<string[]> {
		const listingContract = new ethers.Contract(
			listingsContractAddress,
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
			listingsContractAddress,
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

	async makeOffer(listing: string) {
		const listingContract = new ethers.Contract(
			listingsContractAddress,
			Listings.abi,
			this.provider
		);

		const listingWithSigner = listingContract.connect(
			this.provider.getSigner()
		);

		try {
			// Ether amount to send
			const price = await listingContract.getPriceForListing(listing);

			const offer = await listingWithSigner.makeOffer(listing, {
				value: BigNumber.from(price),
			});
			console.log("(SM) Offer made: ", offer);
			return offer;
		} catch (err) {
			console.log(err);
		}
	}

	async confirmBuy(listing: string) {
		const listingContract = new ethers.Contract(
			listingsContractAddress,
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
