import { QuestionMarkCircleIcon } from "@heroicons/react/solid";

export default function NewListing() {
	return (
		<div className="max-w-7xl mx-auto pt-20 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<form className="space-y-8 divide-y divide-gray-200">
					<div className="space-y-8 divide-y divide-gray-200">
						<div>
							<div>
								<h3 className="text-lg leading-6 font-medium text-gray-900">
									Post an ad
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Tell others about what you are selling.
								</p>
							</div>

							<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
								<div className="sm:col-span-4">
									<div className="sm:col-span-3">
										<label
											htmlFor="first-name"
											className="block text-sm font-medium text-gray-700"
										>
											Title
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="title"
												id="title"
												placeholder="Add a title to your add"
												autoComplete="title"
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
											/>
										</div>
									</div>
								</div>

								<div className="mt-5 sm:flex sm:items-center sm:col-span-6">
									<div>
										<label
											htmlFor="price"
											className="block text-sm font-medium text-gray-700"
										>
											Price
										</label>
										<div className="mt-1 relative rounded-md shadow-sm">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<span className="text-gray-500 sm:text-sm">
													$
												</span>
											</div>
											<input
												type="text"
												name="price"
												id="price"
												className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
												placeholder="0.00"
											/>
											<div className="absolute inset-y-0 right-0 flex items-center">
												<label
													htmlFor="currency"
													className="sr-only"
												>
													Currency
												</label>
												<select
													id="currency"
													name="currency"
													className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
												>
													<option>ETH</option>
													<option>USD</option>
													<option>EUR</option>
												</select>
											</div>
										</div>
									</div>
								</div>

								<div className="sm:col-span-6">
									<label
										htmlFor="about"
										className="block text-sm font-medium text-gray-700"
									>
										Description
									</label>
									<div className="mt-1">
										<textarea
											id="about"
											name="about"
											rows={4}
											className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
											defaultValue={""}
										/>
									</div>
									<p className="mt-2 text-sm text-gray-500">
										Write a few sentences about the item you
										are selling and what condition it is in.
									</p>
								</div>

								<div className="sm:col-span-6">
									<label
										htmlFor="cover-photo"
										className="block text-sm font-medium text-gray-700"
									>
										Photos
									</label>
									<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
										<div className="space-y-1 text-center">
											<svg
												className="mx-auto h-12 w-12 text-gray-400"
												stroke="currentColor"
												fill="none"
												viewBox="0 0 48 48"
												aria-hidden="true"
											>
												<path
													d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
													strokeWidth={2}
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</svg>
											<div className="flex text-sm text-gray-600">
												<label
													htmlFor="file-upload"
													className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
												>
													<span>Upload a file</span>
													<input
														id="file-upload"
														name="file-upload"
														type="file"
														className="sr-only"
													/>
												</label>
												<p className="pl-1">
													or drag and drop
												</p>
											</div>
											<p className="text-xs text-gray-500">
												PNG, JPG, GIF up to 10MB
											</p>
										</div>
									</div>
									<p className="mt-2 text-sm text-gray-500">
										Share some photos of the item.
									</p>
								</div>
							</div>

							<div className="pt-8">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Location
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										Let people know where you're selling the
										item. You'll need to meet up in person
										to finalize the exchange.
									</p>
								</div>
								<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
									<div className="sm:col-span-3">
										<label
											htmlFor="country"
											className="block text-sm font-medium text-gray-700"
										>
											Country
										</label>
										<div className="mt-1">
											<select
												id="country"
												name="country"
												autoComplete="country-name"
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
											>
												<option>United States</option>
												<option>Canada</option>
												<option>Mexico</option>
											</select>
										</div>
									</div>

									<div className="sm:col-span-6">
										<label
											htmlFor="street-address"
											className="block text-sm font-medium text-gray-700"
										>
											Street address
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="street-address"
												id="street-address"
												autoComplete="street-address"
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
											/>
										</div>
									</div>

									<div className="sm:col-span-2">
										<label
											htmlFor="city"
											className="block text-sm font-medium text-gray-700"
										>
											City
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="city"
												id="city"
												autoComplete="address-level2"
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
											/>
										</div>
									</div>

									<div className="sm:col-span-2">
										<label
											htmlFor="region"
											className="block text-sm font-medium text-gray-700"
										>
											State / Province
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="region"
												id="region"
												autoComplete="address-level1"
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
											/>
										</div>
									</div>

									<div className="sm:col-span-2">
										<label
											htmlFor="postal-code"
											className="block text-sm font-medium text-gray-700"
										>
											ZIP / Postal code
										</label>
										<div className="mt-1">
											<input
												type="text"
												name="postal-code"
												id="postal-code"
												autoComplete="postal-code"
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="pt-8">
							<div>
								<h3 className="text-lg leading-6 font-medium text-gray-900">
									Ad Preferences
								</h3>
								<p className="mt-1 text-sm text-gray-500">
									Decide whether you'd like to configure more
									advanced options for your listing.
								</p>
							</div>
							<div className="mt-6">
								<fieldset>
									<div className="mt-4 space-y-4">
										<div className="relative flex items-start">
											<div className="flex items-center h-5">
												<input
													id="comments"
													name="comments"
													type="checkbox"
													className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
												/>
											</div>
											<div className="ml-3 text-sm">
												<label
													htmlFor="comments"
													className="font-medium text-gray-700"
												>
													Auction
												</label>
												<p className="text-gray-500">
													If the price listed is a
													minimum price, you can allow
													people to offer more
												</p>
											</div>
										</div>
										<div className="relative flex items-start">
											<div className="flex items-center h-5">
												<input
													id="candidates"
													name="candidates"
													type="checkbox"
													className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
												/>
											</div>
											<div className="ml-3 text-sm">
												<label
													htmlFor="candidates"
													className="font-medium text-gray-700"
												>
													Save Data in IPFS
												</label>
												<p className="text-gray-500">
													By default all listings data
													is erased after 7 days. For
													a small fee, you can choose
													to save your listing data in
													IPFS indefinitely. This is
													useful if you think the
													seller may want to purchase
													the listing data off of you
													(e.g. this can be useful
													when later re-selling or
													proving provenance, e.g.
													when listing things like
													art, collectables or
													antiques)
												</p>
											</div>
										</div>

										<div className="relative flex items-start">
											<div className="flex items-center h-5">
												<input
													id="offers"
													name="offers"
													type="checkbox"
													className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
												/>
											</div>
											<div className="ml-3 text-sm">
												<label
													htmlFor="offers"
													className="font-medium text-gray-700"
												>
													Trusted Third Party Exchange
												</label>
												<p className="text-gray-500">
													If you'd like to leave your
													item with a trusted third
													party to complete and
													finalize the exchange, you
													can enter their ETH address
													here. This is usually the
													address of a shop, auction
													house or estate agent, but
													it can be any third party
													that you trust to securely
													hold your item until the
													funds are received.
												</p>
											</div>
										</div>

										<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-8 content-center">
											<div className="sm:col-span-1"></div>

											<div className="sm:col-span-7">
												<div className="mt-1 flex rounded-md shadow-sm">
													<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
														ETH address
													</span>
													<input
														type="text"
														name="company-website"
														id="company-website"
														className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
														placeholder="0x"
													/>
												</div>
											</div>
										</div>
									</div>
								</fieldset>
							</div>
						</div>
					</div>

					<div className="pt-5">
						<div className="flex justify-end">
							<button
								type="button"
								className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Cancel
							</button>
							<button
								type="submit"
								className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								Save
							</button>
						</div>
					</div>
				</form>
			</div>
		</div>
	);
}
