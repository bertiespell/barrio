const Listings = artifacts.require("Listings");

contract("Listings.createListing", function (accounts) {
  it("should assert true", async function () {
    await Listings.deployed();
    return assert.isTrue(true);
  });

  it("should store a new listing", async () => {
    const alice = accounts[0]

    const listingContract = await Listings.deployed();
    await listingContract.createListing(
      "QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB", 
      1,
      { from: alice }
    );
  });

  it("should not be able to store more than one listing per ipfs hash", async () => {
    const alice = accounts[0]
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
    const alice = accounts[0]
    const bob = accounts[1]

    const listingContract = await Listings.deployed();
    await listingContract.createListing(
      "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4", 
      2, 
      { from: alice }
    );

    await listingContract.makeOffer(
      "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4", 
      { from: bob, value: 2  }
    );
  });

  it("should hold the money in escrow", async () => {
    const alice = accounts[2]
    const bob = accounts[3]

    const listingContract = await Listings.deployed();

    const bobBalanceBefore = await web3.eth.getBalance(bob);
    const contractBalanceBefore = await web3.eth.getBalance(listingContract.address);
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
    const contractBalanceAfter = await web3.eth.getBalance(listingContract.address);
    
    assert.equal(BigInt(bobBalanceAfter), BigInt(bobBalanceBefore) - BigInt(itemPrice));
    assert.equal(BigInt(contractBalanceAfter), BigInt(contractBalanceBefore) + BigInt(itemPrice));
  });

  it("should allow multiple users to make an offer", async () => {
    const alice = accounts[4]
    const bob = accounts[5]
    const charlie = accounts[6]

    const listingContract = await Listings.deployed();
    const listing = await listingContract.createListing(
      "QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps", 
      2, 
      { from: alice }
    );

    await listingContract.makeOffer(
      "QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps", 
      { from: bob, value: 2  }
    );

    await listingContract.makeOffer(
      "QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps", 
      { from: charlie, value: 2  }
    );
  });

  it("should require the sender to offer enough to match the price", async () => {
    const alice = accounts[7]
    const bob = accounts[8]

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
    const bob = accounts[1]

    const listingContract = await Listings.deployed();

    let called = false;
    try {
      await listingContract.makeOffer(
        "QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4", 
        { from: bob, value: 2  }
      );
    } catch (error) {
      called = true;
    }
    assert(called);
  });
});

contract("Listings.confirmBuy", function (accounts) {
  it("should transfer the price to the buyer", async () => {
    const alice = accounts[0]
    const bob = accounts[1]

    const listingContract = await Listings.deployed();

    const aliceBalanceBefore = await web3.eth.getBalance(alice);
    const contractBalanceBefore = await web3.eth.getBalance(listingContract.address);
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
    const contractBalanceAfter = await web3.eth.getBalance(listingContract.address);

    assert.equal(BigInt(aliceBalanceAfter), BigInt(aliceBalanceBefore) + BigInt(itemPrice));
    assert.equal(BigInt(contractBalanceAfter), BigInt(contractBalanceBefore));
  });

  it("should refund other buyers held in escrow", async () => {
  });

  it("can only be confirmed by a seller in the list", async () => {
  });

});