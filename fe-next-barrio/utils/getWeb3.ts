import Listings from "../public/abi/Listings.json"; 
import Ratings from "../public/abi/Ratings.json"; 
import { BigNumber, ethers } from "ethers";

const listingsContractAddress: string = (process.env.NEXT_PUBLIC_LISTINGS_CONTRACT_ADDRESS as string);
const ratingsContractAddress: string = (process.env.NEXT_PUBLIC_RATINGS_CONTRACT as string);

export type AuctionData = {
	highestOfferAmount: string;
	highestBidder: string;
	offers: Array<Offer>;
	isAccepted: boolean;
}

export type Offer = {
	buyer: string, offer: string

}

export type EthListingData = {
	buyers: string[];
	price: string;
	seller: string;
	bought: boolean;
	timestamp: string;
	isAuction: boolean;
	auctionData: AuctionData | undefined;
	useThirdPartyAddress: string | undefined;
}
export function compareOffers(a: Offer, b: Offer) {
	if (a.offer > b.offer) {
		return -1;
	}
	if (a.offer < b.offer) {
		return 1;
	}
	// a must be equal to b
	return 0;
}

// Uses a singleton pattern to construct, load and get web3
class Web3Connection {
	provider!: ethers.providers.Web3Provider;
	currentAccount: string = "";

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

	async getAccounts(): Promise<string> {
		try {
			const accounts = await this.provider.send(
				"eth_requestAccounts",
				[]
			);

			this.currentAccount = accounts[0];

			return this.currentAccount;
		} catch (err) {
			console.error(err, "err");
			throw Error("(SM) Unable to link metamask");
		}
	}

	async createListing(listing: string, price: string, isAuction: boolean, isPriceInUsd: boolean) {
		const listingContract = new ethers.Contract(
			listingsContractAddress,
			Listings.abi,
			this.provider
		);

		const listingWithSigner = listingContract.connect(
			this.provider.getSigner()
		);

		try {
			const smartContractListing =  await listingWithSigner.createListing(
				listing,
				ethers.utils.parseEther(price),
				isAuction,
				isPriceInUsd
			);

			return await smartContractListing.wait();
		} catch (err) {
			console.error(err, "err");
			throw Error("(SM) Unable to create listing");
		}
	}

	async getRatingsForSeller(address: string) {
		try {
			const ratingsContract = new ethers.Contract(
				ratingsContractAddress,
				Ratings.abi,
				this.provider
			);
		} catch (err) {
			console.error(err);
			throw Error(`(SM) Unable to get rating for address ${address}`);
		}	
	}

	async getAllListings(): Promise<string[]> {
		try {
			const listingContract = new ethers.Contract(
				listingsContractAddress,
				Listings.abi,
				this.provider
			);
	
			return await listingContract.getListingsArray();
		} catch (err) {
			console.error(err, "err");
			throw Error("(SM) Unable to get all listings");
		}
	}

	async getListingData(listing: string): Promise<EthListingData> {
		try {
			const listingContract = new ethers.Contract(
				listingsContractAddress,
				Listings.abi,
				this.provider
			);

			const buyers = await listingContract.getBuyersForListing(listing);

			const isAuction = await listingContract.getIsAuction(listing);

			const auctionData: AuctionData = {offers: [], highestOfferAmount: "", highestBidder: "" } as any;

			if (isAuction && buyers.length) {
				try {
					const getOfferForBuyer = async (buyer: string): Promise<{buyer: string, offer: string}> => {
						const offer = await listingContract.getOfferForBuyerInAuction(listing, buyer)
						
						return {
							buyer,
							offer: ethers.utils.formatEther(offer)
						}
					}
					const offers = await Promise.all(buyers.map(getOfferForBuyer));
					
					const unique: Array<Offer> = [];
					offers.forEach(
						(offer) => {
							// if it's not in unique then push
							if (!unique.find(listing => listing.buyer === offer.buyer)) {
								unique.push(offer)
							}
						}
					)
					auctionData.offers = unique.sort(compareOffers);
					const isAccepted = await listingContract.getIsAcceptedForListing(listing);
					auctionData.isAccepted = isAccepted;
				} catch (err) {
					console.error(err);
					throw Error("(SM) Unable to get offer price for buyer");
				}
				try {
					const highestOfferAmount = await listingContract.getHighestAmountForAuction(listing);
					auctionData.highestOfferAmount = ethers.utils.formatEther(highestOfferAmount);
					auctionData.highestBidder = await listingContract.getHighestBuyerForAuction(listing);
				} catch (err) {
					console.error(err);
					throw Error("(SM) Unable to get highest offer data for listing");
				}
			} 
			const price = await listingContract.getPriceForListing(listing);
			const timestamp = await listingContract.getDateForListing(listing);
			const seller = await listingContract.getSellerForListing(listing);
			const bought = await listingContract.getBoughtForListing(listing);

			let useThirdPartyAddress;
			try {
				useThirdPartyAddress = await listingContract.getThirdPartyForListing(listing);

			} catch (e) {}

			return {
				buyers,
				price: ethers.utils.formatEther(price),
				seller,
				bought,
				timestamp,
				isAuction,
				auctionData,
				useThirdPartyAddress
			};
		} catch (err) {
			console.error(err);
			throw Error(`(SM) Unable to get listing data for listing ${listing}`);
		}
	}

	async makeOfferWithPrice(listing: string, price: string): Promise<any> {
		try {
			const listingContract = new ethers.Contract(
				listingsContractAddress,
				Listings.abi,
				this.provider
			);
	
			const listingWithSigner = listingContract.connect(
				this.provider.getSigner()
			);
	
				return await listingWithSigner.makeOffer(listing, {
					value: BigNumber.from(ethers.utils.parseUnits(price)),
				});
			
		} catch (err) {
			console.error(err);
			throw Error("(SM) Unable to get make offer");
		}
	}

	async makeOffer(listing: string): Promise<any> {
		try {
			const listingContract = new ethers.Contract(
				listingsContractAddress,
				Listings.abi,
				this.provider
			);
	
			const listingWithSigner = listingContract.connect(
				this.provider.getSigner()
			);
	
	
				// Ether amount to send
				let price;
				try {
					price = await listingContract.getPriceForListing(listing);
				} catch (err) {
					console.error(err);
					throw Error("(SM) Unable to get listing price");
				}
				return await listingWithSigner.makeOffer(listing, {
					value: BigNumber.from(price),
				});
		} catch (err) {
			console.error(err);
			throw Error("(SM) Unable to get make offer");
		}
	}

	async acceptOffer(listing: string, buyer: string) {
		const listingContract = new ethers.Contract(
			listingsContractAddress,
			Listings.abi,
			this.provider
		);

		const listingWithSigner = listingContract.connect(
			this.provider.getSigner()
		);

		try {
			return await listingWithSigner.acceptOffer(listing, buyer);
		} catch (err) {
			console.error(err, "err");
			throw Error("(SM) Unable to accept offer");
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
			return await listingWithSigner.confirmBuy(listing);
		} catch (err) {
			console.error(err, "err");
			throw Error("(SM) Unable to confirm buy");
		}
	}
}
export default new Web3Connection();
