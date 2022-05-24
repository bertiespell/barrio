import { Disclosure } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";

const faqs = [
	{
		question: "Why use Barrio?",
		answer: "We produce a colossal amount of goods every year, rather than ending up in landfill it is better for the planet to provide ways to re-sell and re-use items. Barrio leverages the escrow functionality of smart contracts with a blockchain based reputational proof to allow people to exchange goods with confidence. The second hand market is huge, but there is currently no way to buy and sell individual goods (or handcraft items) with crypto. Since our smart contracts store the ipfs hash of the image of the item, it also provides the dual functionality of showing proof of purchase (which may be useful later for insurance claims) as well as proof of provenance which can be useful in the reselling of art, antiques or collectibles.",
	},
	{
		question: "How does Barrio work?",
		answer: "TODO.",
	},
	{
		question:
			"What is the difference between an auction and a standard listing?",
		answer: "In a standard listing your offer is always the same as the listing price, and the seller is free to choose out of any available offers. With an auction, the price can increase to any arbitrary amount above the asking price. The seller is still free to choose which offer to accept, but they're most likely to accept either the highest bid or a buyer with a higher rating.",
	},
	{
		question: "How does the rating system work?",
		answer: "After a purchase is confirmed, the buyer and seller are able to rate each other (out of a score from 1 - 5). This is a useful mechanism to build up reputation over time, which makes people more likely to complete trades with you. The buyer and seller may decide to post the item to each other rather than meeting up in person or using a third party - in these cases, it's useful to know the reviews left by others to know how trust worthy they are.",
	},
	{
		question: 'What\'s a "third party" listing?',
		answer: "Sometimes you may want to use a trusted third party to complete the sale for you. In these cases, rather than the buyer and seller meeting up directly to exchange the goods, the physical items are held in escrow by a trusted third party. This is especially useful for estate agents or auction houses, who may be the intermediary in possession of an item. Alternatively, you may choose to leave your item with a local shop, or a third party service provider. In the future, we'd love to see an decentralized IoT Amazon-style locker, which is able to securely hold the goods, and trigger smart contract fund releases.",
	},
	{
		question: "What if I get outbid?",
		answer: "Don't worry if you get outbid, you can always make a higher counter offer if someone outbids you. You can find out whether you're the current highest bidder by visiting your offers page.",
	},
	{
		question: "What if my offer is not succesfull?",
		answer: "The smart contract that stores all listings uses Chainlink's Keeper functionality to ensure that all unsuccesful bids are returned to you after the listing ends (this is currently set to 7 days).",
	},
	{
		question:
			"What if my offer is accepted but the listing is due to end soon?",
		answer: "We're currently working on a feature to allow a buyer with an accepted offer to extend the time an item is listed for, to allow for a time to completion window.",
	},
	{
		question: "What other uses are there for Barrio?",
		answer: "It's also possible to non-physical items such as services, and build up a reputation for a service that you offer. Barrio can also be used for the service economy, useful for freelancers, teachers and creatives.",
	},
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function FAQs() {
	return (
		<div className="">
			<div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto divide-y-2 divide-gray-200">
					<h2 className="text-center text-3xl font-extrabold text-gray-900 sm:text-4xl">
						Find out more about Barrio
					</h2>
					<dl className="mt-6 space-y-6 divide-y divide-gray-200">
						{faqs.map((faq) => (
							<Disclosure
								as="div"
								key={faq.question}
								className="pt-6"
							>
								{({ open }) => (
									<>
										<dt className="text-lg">
											<Disclosure.Button className="text-left w-full flex justify-between items-start text-gray-400">
												<span className="font-medium text-gray-900">
													{faq.question}
												</span>
												<span className="ml-6 h-7 flex items-center">
													<ChevronDownIcon
														className={classNames(
															open
																? "-rotate-180"
																: "rotate-0",
															"h-6 w-6 transform"
														)}
														aria-hidden="true"
													/>
												</span>
											</Disclosure.Button>
										</dt>
										<Disclosure.Panel
											as="dd"
											className="mt-2 pr-12"
										>
											<p className="text-base text-gray-500">
												{faq.answer}
											</p>
										</Disclosure.Panel>
									</>
								)}
							</Disclosure>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
}
