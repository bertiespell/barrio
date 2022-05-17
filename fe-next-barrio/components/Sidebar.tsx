import {
	ChatIcon,
	ClipboardIcon,
	FireIcon,
	SearchIcon,
	UserIcon,
} from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";

const navigation = [
	{ name: "Profile", icon: UserIcon, href: "#", current: false },
	{ name: "Search", icon: SearchIcon, href: "/listings", current: false },
	{
		name: "Listings",
		icon: ClipboardIcon,
		href: "#",
		current: false,
	},
	{ name: "Offers", icon: FireIcon, href: "#", count: 4, current: false },
	{ name: "Messages", icon: ChatIcon, href: "#", count: 3, current: false },
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ setSidebarOpen }: any) {
	return (
		<div className="h-full flex-1 flex flex-col min-h-0 bg-indigo-700">
			<div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
				<div className="flex items-start justify-between px-4">
					<img
						className="h-8 w-auto"
						src="https://tailwindui.com/img/logos/workflow-logo-indigo-300-mark-white-text.svg"
						alt="Barrio"
					/>
					<div>
						<button
							type="button"
							className="-m-2 p-2 text-gray-400 hover:text-gray-500 right object-right"
							onClick={() => setSidebarOpen(false)}
						>
							<span className="sr-only">Close panel</span>
							<XIcon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
				</div>
				<nav
					className="mt-5 flex-1 px-2 space-y-1"
					aria-label="Sidebar"
				>
					{navigation.map((item) => (
						<a
							key={item.name}
							href={item.href}
							className={classNames(
								item.current
									? "bg-indigo-800 text-white"
									: "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75",
								"group flex items-center px-2 py-2 text-sm font-medium rounded-md"
							)}
						>
							<item.icon
								className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
								aria-hidden="true"
							/>
							<span className="flex-1">{item.name}</span>
							{item.count ? (
								<span
									className={classNames(
										item.current
											? "bg-indigo-600"
											: "bg-indigo-800",
										"ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full"
									)}
								>
									{item.count}
								</span>
							) : null}
						</a>
					))}
				</nav>
			</div>
			<div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
				<a href="#" className="flex-shrink-0 w-full group block">
					<div className="flex items-center">
						<div>
							<img
								className="inline-block h-9 w-9 rounded-full"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-white">
								Tom Cook
							</p>
							<p className="text-xs font-medium text-indigo-200 group-hover:text-white">
								View profile
							</p>
						</div>
					</div>
				</a>
			</div>
		</div>
	);
}
