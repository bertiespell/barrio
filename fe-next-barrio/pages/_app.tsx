import "../styles/globals.css";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import { useEffect, useState } from "react";
import { CardListing } from "./listings";
import { getAllListings, getListing } from "../utils/getOrbitData";
import { makeGatewayURL } from "../utils/getIpfs";
import getWeb3 from "../utils/getWeb3";
import ListingsProvider from "../context/listings";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<>
			<Layout>
				<ListingsProvider>
					<Component {...pageProps} />
				</ListingsProvider>
			</Layout>
		</>
	);
}

export default MyApp;
