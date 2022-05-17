import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { CardListing } from "./listings";
import { getAllListings, getListing } from "../utils/getOrbitData";
import { makeGatewayURL } from "../utils/getIpfs";

function MyApp({ Component, pageProps }: AppProps) {
	const [data, setData] = useState<Array<CardListing>>([]);
	const [seenProducts, setSeenProducts] = useState<{
		[id: string]: boolean;
	}>({} as any);
	const validateProduct = (product: CardListing) =>
		!product.id ? false : true;

	useEffect(() => {
		getAllListings().then((res: any) => {
			let count = 0;
			for (const cid in res?.data) {
				// TODO: this needs throttling properly
				if (count > 2) return;
				count++;
				getListing(cid).then((listing) => {
					if (!listing) return;

					const newListing: CardListing = {
						id: listing?.data.metadata.imageFilesCID,
						name: listing?.data.metadata.title,
						href: `/listings/${cid}`,
						price: listing?.data.metadata.price,
						imageSrc: makeGatewayURL(
							cid as string,
							listing?.data.files[0]._name
						),
						imageAlt: listing?.data.metadata.description,
					};

					if (!seenProducts[cid]) {
						seenProducts[cid] = true;
						setSeenProducts(seenProducts);
						if (validateProduct(newListing)) {
							data.push(newListing);
							setData(data.concat(newListing));
						}
					}
				});
			}
		});
	}, [data]);

	return (
		<>
			<Layout>
				<Component products={data} {...pageProps} />
			</Layout>
		</>
	);
}

export default MyApp;
