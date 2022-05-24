const Migrations = artifacts.require("Migrations");
const Listings = artifacts.require("Listings");
const Ratings = artifacts.require("Ratings");

module.exports = function (deployer) {
	deployer.deploy(Migrations);
	deployer
		.deploy(Listings)
		.then(() => deployer.deploy(Ratings, Listings.address));
};
