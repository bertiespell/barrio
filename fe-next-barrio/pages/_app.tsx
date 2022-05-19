import "../styles/globals.css";
import type { AppContext, AppProps } from "next/app";
import Layout from "../components/Layout";
import ListingsProvider from "../context/listings";
import App from "next/app";

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

MyApp.getInitialProps = async (appContext: AppContext) => {
	const appProps = await App.getInitialProps(appContext);

	return { ...appProps };
};

export default MyApp;
