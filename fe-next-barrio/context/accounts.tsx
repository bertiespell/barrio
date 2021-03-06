import React, { useEffect, useState } from "react";

import getWeb3 from "../utils/getWeb3";

export const AccountsContext = React.createContext({});

const AccountsProvider = ({ children }: any) => {
	const [loading, setLoading] = useState(true);

	const [account, setAccount] = useState("");

	const getAccounts = async () => {
		try {
			const newAccount = await getWeb3.getAccounts();
			if (newAccount) setAccount(newAccount);
			setLoading(false);
			return newAccount;
		} catch (e) {
			console.log(e);
		}
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
			{children}
		</AccountsContext.Provider>
	);
};

export default AccountsProvider;
