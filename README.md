# Barrio

Welcome to Barrio! A decentralized classified ads dApp.

We produce a colossal amount of goods every year, rather than ending up in landfill it is better reuse, as well as recycle. Every time we buy a new item we leave a small footprint on the planet. It's estimated that in textile waste alone, 92 million tons are created globally! Apps like Gumtree, Wallapop and Depop are hugely popular and the second hand market valuation is huge, yet no blockchain based versions of these apps exist.

This is a shame, because Ethereum provides some particularly useful features for ensuring the successful completion of second hand purchases. Barrio leverages these to provide an escrow functionality within it's smart contracts, as well as a reputational proof system to allow people to exchange goods and services with confidence.

### How it works

Barrio allows users to list items or services for sale, and to make offers on these items.

It provides two ways of doing this: either a standard listing or an auction.

In a standard listing the price is set, and after making an offer, buyers arrange with the seller to organize the exchange. During the exchange, when the buyer is in possession of the items they can "Confirm the purchase" in the app - which the buyer can then verify before parting ways. Once a purchase is confirmed, any unsuccessful offers are refunded.

Listings are currently kept for seven days - if nobody confirms a buy in this time, Chainlink Keepers are used to refund all buyers.

In an auction, the listed price is a minimum, and buyers are able to offer any amount above this. For the seller, there is an additional step since they must accept an offer before the buyer can confirm the purchase.

For any type of listing, the seller may provide the Ethereum wallet address of a trusted third party, such as an estate agent, auction house or possibly a local shop. They leave their item with the third party, who handles the rest of the transactions for them. Usually, the buyer will pick somebody a seller is also likely to trust, so that the goods can be exchanged easily.

After a purchase is confirmed, the buyer and seller are now able to leave a review of each other. Over time, users increase their reputation by accumulating positive ratings, which facilitates new types of trade, such as exchange via post. With a high enough rating, a buyer may feel confident enough to confirm a purchase before receiving the goods.

### Folder Structure

-   evm: contains the smart contract logic and testing
-   be-barrio: contains the backend services to connect to IPFS via web3.storage, and OrbitDB for saving listings metadata
-   fe-next-barrio: is the front-end application for interacting with the smart contracts

# Architecture
