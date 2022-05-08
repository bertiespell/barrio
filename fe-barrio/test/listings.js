const Listings = artifacts.require("Listings");

contract("Listings.createListing", function (accounts) {
	it("should assert true", async function () {
		await Listings.deployed();
		return assert.isTrue(true);
	});

	it("should store a new listing", async () => {
		const alice = accounts[0];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			1,
			{ from: alice }
		);
	});

	it("should not be able to store more than one listing per ipfs hash", async () => {
		const alice = accounts[0];
		const listingContract = await Listings.deployed();

		let called = false;
		try {
			await listingContract.createListing(
				"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
				1,
				{ from: alice }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Listings.makeOffer", function (accounts) {
	it("should make an offer on a listing", async () => {
		const alice = accounts[0];
		const bob = accounts[1];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			2,
			{ from: alice }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, value: 2 }
		);
	});

	it("should hold the money in escrow", async () => {
		const alice = accounts[2];
		const bob = accounts[3];

		const listingContract = await Listings.deployed();

		const bobBalanceBefore = await web3.eth.getBalance(bob);
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);
		const itemPrice = 2;

		await listingContract.createListing(
			"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			itemPrice,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		const bobBalanceAfter = await web3.eth.getBalance(bob);
		const contractBalanceAfter = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(bobBalanceAfter),
			BigInt(bobBalanceBefore) - BigInt(itemPrice)
		);
		assert.equal(
			BigInt(contractBalanceAfter),
			BigInt(contractBalanceBefore) + BigInt(itemPrice)
		);
	});

	it("should allow multiple users to make an offer", async () => {
		const alice = accounts[4];
		const bob = accounts[5];
		const charlie = accounts[6];

		const listingContract = await Listings.deployed();
		const listing = await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			2,
			{ from: alice }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: 2 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, value: 2 }
		);
	});

	it("should require the sender to offer enough to match the price", async () => {
		const alice = accounts[7];
		const bob = accounts[8];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			20,
			{ from: alice }
		);

		let called = false;
		try {
			await listingContract.makeOffer(
				"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
				{ from: bob }
			);
		} catch (error) {
			called = true;
		}
		assert(called);
	});

	it("should not allow you to buy twice", async () => {
		const bob = accounts[1];

		const listingContract = await Listings.deployed();

		let called = false;
		try {
			await listingContract.makeOffer(
				"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
				{ from: bob, value: 2 }
			);
		} catch (error) {
			called = true;
		}
		assert(called);
	});
});

contract("Listings.confirmBuy", function (accounts) {
	it("should transfer the price to the buyer", async () => {
		const alice = accounts[0];
		const bob = accounts[1];

		const listingContract = await Listings.deployed();

		const aliceBalanceBefore = await web3.eth.getBalance(alice);
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);
		const itemPrice = 2;

		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			itemPrice,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.confirmBuy(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			{ from: bob, gasPrice: 0 }
		);

		const aliceBalanceAfter = await web3.eth.getBalance(alice);
		const contractBalanceAfter = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(aliceBalanceAfter),
			BigInt(aliceBalanceBefore) + BigInt(itemPrice)
		);
		assert.equal(
			BigInt(contractBalanceAfter),
			BigInt(contractBalanceBefore)
		);
	});

	it("should refund other buyers held in escrow", async () => {
		const alice = accounts[2];
		const bob = accounts[3];
		const charlie = accounts[4];
		const david = accounts[5];

		const listingContract = await Listings.deployed();

		const bobBalanceBefore = await web3.eth.getBalance(bob);
		const charlieBalanceBefore = await web3.eth.getBalance(charlie);
		const davidBalanceBefore = await web3.eth.getBalance(david);
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);

		const itemPrice = 2;

		await listingContract.createListing(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			itemPrice,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: charlie, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: david, value: itemPrice, gasPrice: 0 }
		);

		const contractBalanceAfterOffers = await web3.eth.getBalance(
			listingContract.address
		);
		assert.equal(
			BigInt(contractBalanceAfterOffers),
			BigInt(contractBalanceBefore) + BigInt(itemPrice * 3)
		);

		await listingContract.confirmBuy(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, gasPrice: 0 }
		);

		const bobBalanceAfter = await web3.eth.getBalance(bob);
		const charlieBalanceAfter = await web3.eth.getBalance(charlie);
		const davidBalanceAfter = await web3.eth.getBalance(david);

		// bob is the only one who pays
		assert.equal(
			BigInt(bobBalanceAfter),
			BigInt(bobBalanceBefore) - BigInt(itemPrice)
		);
		assert.equal(BigInt(charlieBalanceBefore), BigInt(charlieBalanceAfter));
		assert.equal(BigInt(davidBalanceBefore), BigInt(davidBalanceAfter));

		// in the end the contract has what it started with
		const contractBalanceAfterConfirm = await web3.eth.getBalance(
			listingContract.address
		);
		assert.equal(
			BigInt(contractBalanceAfterConfirm),
			BigInt(contractBalanceBefore)
		);
	});

	it("can only be confirmed by a seller in the list", async () => {
		const alice = accounts[6];
		const bob = accounts[7];
		const charlie = accounts[8];

		const listingContract = await Listings.deployed();
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.confirmBuy(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				{ from: charlie, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Listings.checkUpkeep false", function (accounts) {
	it("should return false for newly added listings", async () => {
		const alice = accounts[0];

		const listingContract = await Listings.deployed();
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			{ from: alice, gasPrice: 0 }
		);

		const upkeep = await listingContract.checkUpkeep([]);

		assert.equal(upkeep.upkeepNeeded, false);
		assert.equal(
			upkeep.performData,
			web3.eth.abi.encodeParameter("string[]", [])
		);
	});
});

// Since this artifically sets the blocktime in the EVM to a week's time
// We need to run it in a separate `contract` block to keep it idempotent
contract("Listings.checkUpkeep true", function (accounts) {
	it("should return true for listings over a week old", async () => {
		const alice = accounts[0];

		const listingContract = await Listings.deployed();
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			{ from: alice, gasPrice: 0 }
		);

		await increase(604801);

		const upkeep = await listingContract.checkUpkeep([]);

		assert.equal(upkeep.upkeepNeeded, true);
		assert.equal(
			upkeep.performData,
			web3.eth.abi.encodeParameter("string[]", [
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			])
		);
	});
});

// Since this artifically sets the blocktime in the EVM to a week's time
// We need to run it in a separate `contract` block to keep it idempotent
contract("Listings.checkUpkeep multiple true", function (accounts) {
	it("should return true for listings over a week old", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const charlie = accounts[2];

		const listingContract = await Listings.deployed();
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.createListing(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			itemPrice,
			{ from: bob, gasPrice: 0 }
		);

		await listingContract.createListing(
			"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			itemPrice,
			{ from: charlie, gasPrice: 0 }
		);

		await increase(604801);

		const upkeep = await listingContract.checkUpkeep([]);

		assert.equal(upkeep.upkeepNeeded, true);
		assert.equal(
			upkeep.performData,
			web3.eth.abi.encodeParameter("string[]", [
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
				"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			])
		);
	});
});

async function increase(duration) {
	return new Promise((resolve, reject) => {
		web3.currentProvider.send(
			{
				jsonrpc: "2.0",
				method: "evm_increaseTime",
				params: [duration],
				id: new Date().getTime(),
			},
			(err, result) => {
				// second call within the callback
				web3.currentProvider.send(
					{
						jsonrpc: "2.0",
						method: "evm_mine",
						params: [],
						id: new Date().getTime(),
					},
					(err, result) => {
						// need to resolve the Promise in the second callback
						resolve();
					}
				);
			}
		);
	});
}

contract("Listings.performUpkeep", function (accounts) {
	it("should remove listings that are over a week old", async () => {
		const alice = accounts[0];
		const bob = accounts[1];

		const listingContract = await Listings.deployed();
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		const contractBalanceAfterOffer = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceAfterOffer),
			BigInt(contractBalanceBefore) + BigInt(itemPrice)
		);

		await increase(604801);

		await listingContract.performUpkeep(
			web3.eth.abi.encodeParameter("string[]", [
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			])
		);

		const contractBalanceAfterUpkeep = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceAfterUpkeep),
			BigInt(contractBalanceBefore)
		);
	});

	it("should not remove listings that are not over a week old", async () => {
		const alice = accounts[2];
		const bob = accounts[3];

		const listingContract = await Listings.deployed();
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);
		const itemPrice = 2;

		await listingContract.createListing(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			itemPrice,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		const contractBalanceAfterOffer = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceAfterOffer),
			BigInt(contractBalanceBefore) + BigInt(itemPrice)
		);

		await listingContract.performUpkeep(
			web3.eth.abi.encodeParameter("string[]", [
				"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			])
		);

		const contractBalanceAfterUpkeep = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceAfterUpkeep),
			BigInt(contractBalanceAfterOffer)
		);
	});
});
