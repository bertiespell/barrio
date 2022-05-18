import { useCallback, useContext, useEffect, useState } from "react";
import OffersModal from "../components/OffersModal";
import { ListingsContext } from "../context/listings";
import getWeb3 from "../utils/getWeb3";
import { CardListing, Offer } from "./listings";

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function MyListings() {
	const { listings, loading } = useContext(ListingsContext);

	const [currentAccount, setCurrentAccount] = useState(
		getWeb3.currentAccount
	);
	const [showOffers, setShowOffers] = useState(false);
	const [offers, setOffers] = useState<Array<Offer>>([]);

	// Not really sure why I have to do this
	// But we need the component to rerender after we have the account
	// info from web3
	const [, updateState] = useState();
	const forceUpdate = useCallback(() => updateState({} as any), []);

	const getAccount = async () => {
		const account = await getWeb3.getAccounts();
		setCurrentAccount(account);
		forceUpdate();
	};

	useEffect(() => {
		getAccount();
	});

	return (
		<div className="max-w-7xl mx-auto pt-20 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-xl font-semibold text-gray-900">
							Your Listings
						</h1>
						<p className="mt-2 text-sm text-gray-700">
							View all your listings here, and see any offers that
							have been made.
						</p>
					</div>
				</div>
				<div className="mt-8 flex flex-col">
					<div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle">
							<div className="shadow-sm ring-1 ring-black ring-opacity-5">
								<table
									className="min-w-full border-separate"
									style={{ borderSpacing: 0 }}
								>
									<thead className="bg-gray-50">
										<tr>
											<th
												scope="col"
												className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
											>
												Title
											</th>
											<th
												scope="col"
												className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
											>
												Description
											</th>
											<th
												scope="col"
												className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
											>
												Offers
											</th>
											<th
												scope="col"
												className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
											>
												<span className="sr-only">
													View
												</span>
											</th>
										</tr>
									</thead>
									<tbody className="bg-white">
										{listings
											?.filter(
												(product) =>
													product.user ===
													currentAccount
											)
											.map((listing, listingIdx) => (
												<tr key={listing.id}>
													<td
														className={classNames(
															listingIdx !==
																listings.length -
																	1
																? "border-b border-gray-200"
																: "",
															"whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
														)}
													>
														{listing.name}
													</td>
													<td
														className={classNames(
															listingIdx !==
																listings.length -
																	1
																? "border-b border-gray-200"
																: "",
															"whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
														)}
													>
														{`${listing.description.substring(
															0,
															40
														)}...`}
													</td>
													<td
														className={classNames(
															listingIdx !==
																listings.length -
																	1
																? "border-b border-gray-200"
																: "",
															"whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
														)}
													>
														{listing.offersMade
															.length ? (
															// TODO: sort this based on offers with prices in an auction
															<a
																href={`#`}
																className="text-indigo-600 hover:text-indigo-900"
																onClick={(
																	e
																) => {
																	e.preventDefault();
																	setOffers(
																		listing.offersMade.map(
																			(
																				offer
																			) => ({
																				user: offer.user,
																				price: listing.price,
																			})
																		)
																	);
																	setShowOffers(
																		true
																	);
																}}
															>
																View Offers
																<span className="sr-only">
																	,{" "}
																	{
																		listing.name
																	}
																</span>
															</a>
														) : (
															"No offers received"
														)}
													</td>

													<td
														className={classNames(
															listingIdx !==
																listings.length -
																	1
																? "border-b border-gray-200"
																: "",
															"relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
														)}
													>
														<a
															href={`/listings/${listing.id}`}
															className="text-indigo-600 hover:text-indigo-900"
														>
															View
															<span className="sr-only">
																, {listing.name}
															</span>
														</a>
													</td>
												</tr>
											))}
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>
			<OffersModal
				open={showOffers}
				setOpen={setShowOffers}
				offers={offers}
			/>
		</div>
	);
}