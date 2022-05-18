import { useCallback, useContext, useEffect, useState } from "react";
import ConfirmBuy from "../components/ConfirmBuy";
import { ListingsContext } from "../context/listings";
import getWeb3 from "../utils/getWeb3";
import { CardListing } from "./listings";

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function MyOffers() {
	const [openConfirmBuyModal, setOpenConfirmBuyModal] = useState(false);
	const { listings, loading } = useContext(ListingsContext);

	const [currentAccount, setCurrentAccount] = useState("");
	const [listingToConfirm, setListingToConfirm] = useState({});
	const [offers, setOffers] = useState<Array<CardListing>>([]);

	// Force udpate
	// const [, updateState] = useState();
	// const forceUpdate = useCallback(() => updateState({} as any), []);

	const setAccount = async () => {
		console.log("???");
		const account = await getWeb3.getAccounts();
		setCurrentAccount(account);
	};

	// const setProducts = async () => {
	// 	const filteredProducts = products?.filter((product) =>
	// 		product.offersMade.find(
	// 			(offer) =>
	// 				offer.user.toLowerCase() === currentAccount.toLowerCase()
	// 		)
	// 	);
	// 	setOffers(filteredProducts);
	// };

	useEffect(() => {
		setAccount();
	}, []);

	useEffect(() => {
		console.log("?");
		const filteredListings = listings?.filter((product) =>
			product.offersMade.find(
				(offer) =>
					offer.user.toLowerCase() === currentAccount.toLowerCase()
			)
		);

		setOffers(filteredListings);
	}, [currentAccount, listings]);

	console.log(currentAccount, offers);
	console.log("LISTINGS", listings, "loading", loading);
	return (
		<div className="">
			<div className="max-w-7xl mx-auto pt-20 pb-20 px-4 sm:px-6 lg:px-8">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="sm:flex sm:items-center">
						<div className="sm:flex-auto">
							<h1 className="text-xl font-semibold text-gray-900">
								Your Offers
							</h1>
							<p className="mt-2 text-sm text-gray-700">
								View everything that you've made an offer on.
								Once you've made an offer, you'll need to
								coordinate with the seller to finalize the
								exchange. You can either meet up in person, or
								leave the funds and goods with a trusted third
								party.
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
													Seller
												</th>
												<th
													scope="col"
													className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
												>
													<span className="sr-only">
														Seller
													</span>
												</th>
												<th
													scope="col"
													className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
												>
													<span className="sr-only">
														View
													</span>
												</th>
												<th
													scope="col"
													className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
												>
													<span className="sr-only">
														Confirm Buy
													</span>
												</th>
											</tr>
										</thead>
										<tbody className="bg-white">
											{offers.map(
												(listing, listingIdx) => (
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
																"whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
															)}
														>
															{listing.user}
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
															<button className="text-indigo-600 hover:text-indigo-900">
																Send Message
															</button>
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
																View Listing
																<span className="sr-only">
																	,{" "}
																	{
																		listing.name
																	}
																</span>
															</a>
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
															<button
																type="button"
																className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
																onClick={(
																	e
																) => {
																	e.preventDefault();
																	setListingToConfirm(
																		listing
																	);
																	setOpenConfirmBuyModal(
																		true
																	);
																}}
															>
																Confirm Buy
															</button>
														</td>
													</tr>
												)
											)}
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
				<ConfirmBuy
					open={openConfirmBuyModal}
					setOpen={setOpenConfirmBuyModal}
					listing={listingToConfirm}
				/>
			</div>
		</div>
	);
}
