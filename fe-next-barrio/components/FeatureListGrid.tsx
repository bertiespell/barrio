import { BeakerIcon, CheckIcon } from "@heroicons/react/outline";

const features = [
	{
		name: "Sell Items",
		description: "Make money by listing your old items for sale.",
		inDevelopment: false,
	},
	{
		name: "Buy Items",
		description:
			"Use your crypto to buy unique, rare and second-hand items.",
		inDevelopment: false,
	},
	{
		name: "Auction",
		description: "Get the best deal by participating in an auction.",
		inDevelopment: true,
	},
	{
		name: "Pay in USD",
		description:
			"Buy and sell with confidence by listing the sale price in USD.",
		inDevelopment: true,
	},
	{
		name: "IPFS Image data",
		description: "Listing images are stored securely in IPFS.",
		inDevelopment: false,
	},
	{
		name: "OrbitDB",
		description:
			"Listing metadata is saved using p2p decentralized storage.",
		inDevelopment: false,
	},
	{
		name: "Trusted Third Party Exchanges",
		description:
			"Allow a trusted third party to complete the exchange. This might be a local shop, estate agent or auction house.",
		inDevelopment: true,
	},
	{
		name: "Reviews",
		description:
			"Buy with confidence by seeing reputational scores ensured on the blockchain.",
		inDevelopment: true,
	},
	{
		name: "Encrypted Messaging",
		description:
			"A decentralized encrypted messaging service to complete your trades.",
		inDevelopment: true,
	},
	{
		name: "Advances Profiles",
		description:
			"Build reputation quickly by linking existing social media accounts, or remain anonymous and simply use your Metamask wallet address to do business.",
		inDevelopment: true,
	},
	{
		name: "Reward System",
		description:
			"Earn rewards for securing Barrio's data and contribute to this exciting developing ecosystem.",
		inDevelopment: true,
	},
	{
		name: "Long-term IPFS Storage",
		description:
			"Store images of your rare or collectible items for the long-term, and later prove provenance",
		inDevelopment: true,
	},
];

export default function FeatureListGrid() {
	return (
		<div className="bg-white">
			<div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8">
				<div className="max-w-3xl mx-auto text-center">
					<h2 className="text-3xl font-extrabold text-gray-900">
						A Feature Rich Ecosystem
					</h2>
					<p className="mt-4 text-lg text-gray-500">
						We're building a decentralized exchange of goods and
						services to empower people and save the planet.
					</p>
				</div>
				<dl className="mt-12 space-y-10 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-12 lg:grid-cols-4 lg:gap-x-8">
					{features.map((feature) => (
						<div key={feature.name} className="relative">
							<dt>
								{feature.inDevelopment ? (
									<BeakerIcon
										className="absolute h-6 w-6 text-blue-300"
										aria-hidden="true"
									/>
								) : (
									<CheckIcon
										className="absolute h-6 w-6 text-green-500"
										aria-hidden="true"
									/>
								)}

								<p className="ml-9 text-lg leading-6 font-medium text-gray-900">
									{feature.name}
								</p>
							</dt>
							<dd className="mt-2 ml-9 text-base text-gray-500">
								{feature.description}
							</dd>
						</div>
					))}
				</dl>
			</div>
		</div>
	);
}
