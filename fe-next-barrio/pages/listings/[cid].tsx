import { useEffect, useState } from "react";
import { Disclosure, Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/solid";
import { HeartIcon, MinusSmIcon, PlusSmIcon } from "@heroicons/react/outline";
import { getListing } from "../../utils/getOrbitData";
import { useRouter } from "next/router";
import { IpfsImage, ProductData } from "../../types/Listings";
import { makeGatewayURL } from "../../utils/getIpfs";

function classNames(...classes: any[]) {
	return classes.filter(Boolean).join(" ");
}

export default function Listing() {
	const router = useRouter();
	const { cid } = router.query;

	const [data, setData] = useState<ProductData | null>(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (!router.isReady) return;
		setLoading(true);
		getListing(cid as string).then((res) => {
			// fetch the images from ipfs
			const images = res?.data.files.map((image: IpfsImage) => {
				return {
					id: image.cid,
					name: image._name,
					src: makeGatewayURL(cid as string, image._name),
				};
			});

			const data: ProductData = {
				name: res?.data.metadata.title,
				price: res?.data.metadata.price,
				description: res?.data.metadata.description,
				location: res?.data.metadata.location,
				images,
				// TODO: implement rating
				rating: 5,
				details: [
					{
						name: "Offers",
						items: res?.data.metadata.offersMade.map(
							(address: string) => {
								return {
									address: address,
									price: res?.data.metadata.price,
								};
							}
						),
					},
				],
			};

			setData(data as any);
			setLoading(false);
			return res;
		});
	}, [router.isReady]);

	if (isLoading) return <p>Loading...</p>;
	if (!data) return <p>No profile data</p>;

	return (
		<div className="bg-white">
			<div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
				<div className="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
					{/* Image gallery */}
					<Tab.Group as="div" className="flex flex-col-reverse">
						{/* Image selector */}
						<div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
							<Tab.List className="grid grid-cols-4 gap-6">
								{data.images.map((image) => (
									<Tab
										key={image.id}
										className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
									>
										{({ selected }) => (
											<>
												<span className="sr-only">
													{image.name}
												</span>
												<span className="absolute inset-0 rounded-md overflow-hidden">
													<img
														src={image.src}
														alt=""
														className="w-full h-full object-center object-cover"
													/>
												</span>
												<span
													className={classNames(
														selected
															? "ring-indigo-500"
															: "ring-transparent",
														"absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none"
													)}
													aria-hidden="true"
												/>
											</>
										)}
									</Tab>
								))}
							</Tab.List>
						</div>

						<Tab.Panels className="w-full aspect-w-1 aspect-h-1">
							{data.images.map((image) => (
								<Tab.Panel key={image.id}>
									<img
										src={image.src}
										alt={image.alt}
										className="w-full h-full object-center object-cover sm:rounded-lg"
									/>
								</Tab.Panel>
							))}
						</Tab.Panels>
					</Tab.Group>

					{/* Product info */}
					<div className="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
						<h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
							{data.name}
						</h1>

						<div className="mt-3">
							<h2 className="sr-only">Product information</h2>
							<p className="text-3xl text-gray-900">
								{data.price} ETH
							</p>
						</div>

						{/* Reviews */}
						<div className="mt-3">
							<h3 className="sr-only">Reviews</h3>
							<div className="flex items-center">
								<div className="flex items-center">
									{[0, 1, 2, 3, 4].map((rating) => (
										<StarIcon
											key={rating}
											className={classNames(
												data.rating > rating
													? "text-indigo-500"
													: "text-gray-300",
												"h-5 w-5 flex-shrink-0"
											)}
											aria-hidden="true"
										/>
									))}
								</div>
								<p className="sr-only">
									{data.rating} out of 5 stars
								</p>
							</div>
						</div>

						<div className="mt-6">
							<h3 className="sr-only">Description</h3>

							<div
								className="text-base text-gray-700 space-y-6"
								dangerouslySetInnerHTML={{
									__html: data.description,
								}}
							/>
						</div>

						<form className="mt-6">
							<div className="mt-10 flex sm:flex-col1">
								<button
									type="submit"
									className="max-w-xs flex-1 bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500 sm:w-full"
								>
									{/* TODO: Use metamask to make an offer here */}
									Buy
								</button>

								<button
									type="button"
									className="ml-4 py-3 px-3 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500"
								>
									<HeartIcon
										className="h-6 w-6 flex-shrink-0"
										aria-hidden="true"
									/>
									<span className="sr-only">
										Add to favorites
									</span>
								</button>
							</div>
						</form>

						<section
							aria-labelledby="details-heading"
							className="mt-12"
						>
							<h2 id="details-heading" className="sr-only">
								Additional details
							</h2>

							<div className="border-t divide-y divide-gray-200">
								{data.details.map((detail) =>
									detail.items.length ? (
										<Disclosure as="div" key={detail.name}>
											{({ open }) => (
												<>
													<h3>
														<Disclosure.Button className="group relative w-full py-6 flex justify-between items-center text-left">
															<span
																className={classNames(
																	open
																		? "text-indigo-600"
																		: "text-gray-900",
																	"text-sm font-medium"
																)}
															>
																{detail.name}
															</span>
															<span className="ml-6 flex items-center">
																{open ? (
																	<MinusSmIcon
																		className="block h-6 w-6 text-indigo-400 group-hover:text-indigo-500"
																		aria-hidden="true"
																	/>
																) : (
																	<PlusSmIcon
																		className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
																		aria-hidden="true"
																	/>
																)}
															</span>
														</Disclosure.Button>
													</h3>
													<Disclosure.Panel
														as="div"
														className="pb-6 prose prose-sm"
													>
														<ul role="list">
															{detail.items.map(
																(item) => (
																	<li
																		key={
																			item.address
																		}
																	>
																		{
																			item.address
																		}{" "}
																		<b>
																			{
																				item.price
																			}{" "}
																			ETH
																		</b>
																	</li>
																)
															)}
														</ul>
													</Disclosure.Panel>
												</>
											)}
										</Disclosure>
									) : (
										"No buyers yet, be the first and make an offer!"
									)
								)}
							</div>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
