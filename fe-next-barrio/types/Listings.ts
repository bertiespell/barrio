export type BuyOffer = {
	address: string;
	price: string;
};

export type IpfsImage = {
	cid: string;
	_name: string;
};

export type ProductData = {
	name: string;
	price: string;
	description: string;
	location: string;
	images: Array<any>;
	rating: number;
	details: Array<{
		name: string;
		items: Array<BuyOffer>;
	}>;
};