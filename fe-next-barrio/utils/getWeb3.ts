import Listings from "../public/abi/Listings.json"; //truffle project dir
import { BigNumber, ethers } from "ethers";

const listingsContractAddress: string = (process.env.NEXT_PUBLIC_LISTINGS_CONTRACT_ADDRESS as string);

// Uses a singleton pattern to construct, load and get web3
class Web3Connection {
	provider!: ethers.providers.Web3Provider;
	currentAccount!: string;

	constructor() {
		if ((Web3Connection as any)._instance) {
			return (Web3Connection as any)._instance;
		}
		
		if (typeof window !== "undefined") {
			this.provider = new ethers.providers.Web3Provider(
				(window as any).ethereum
				);
				(Web3Connection as any)._instance = this;
		  }

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
			console.error(err, "err");
			throw Error("(SM) Unable to link metamask");
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
			console.error(err, "err");
			throw Error("(SM) Unable to create listing");
		}
	}

	async getAllListings(): Promise<string[] | Error> {
		try {
			const listingContract = new ethers.Contract(
				listingsContractAddress,
				Listings.abi,
				this.provider
			);
	
			const allListings = await listingContract.getListingsArray();
			console.log("(SM) All listings retrieved: ", allListings);
			return allListings;
		} catch (err) {
			console.error(err, "err");
			throw Error("(SM) Unable to get all listings");
		}
	}

	async getListingData(listing: string): Promise<{
		buyers: string[];
		price: string;
		seller: string;
	} | Error> {
		try {
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
		} catch (err) {
			console.error(err, "err");
			throw Error("(SM) Unable to get listing data");
		}
	}

	async makeOffer(listing: string): Promise<any | Error> {
		try {
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

				return offer;
			} catch (err) {
				console.log(err);
			}
		} catch (err) {
			console.error(err, "err");
			throw Error("(SM) Unable to get make offer");
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
			console.error(err, "err");
			throw Error("(SM) Unable to confirm buy");
		}
	}
}
export default new Web3Connection();
