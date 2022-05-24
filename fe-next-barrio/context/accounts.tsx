import React, { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

import getWeb3 from "../utils/getWeb3";

export const AccountsContext = React.createContext({});

const AccountsProvider = ({ children }: any) => {
	const [loading, setLoading] = useState(true);

	const [account, setAccount] = useState("");

	const getAccounts = async () => {
		const newAccount = await getWeb3.getAccounts();
		setAccount(newAccount);
		setLoading(false);
	};

	useEffect(() => {
		getAccounts();
	}, []);

	return (
		<AccountsContext.Provider
			value={{
				account,
				getAccounts,
			}}
		>
			{loading ? (
				<div className="max-w-7xl mx-auto pt-20 pb-20 px-4 sm:px-6 lg:px-8">
					<div className="px-4 sm:px-6 lg:px-8">
						<LoadingSpinner />
					</div>
				</div>
			) : (
				children
			)}
		</AccountsContext.Provider>
	);
};

export default AccountsProvider;
