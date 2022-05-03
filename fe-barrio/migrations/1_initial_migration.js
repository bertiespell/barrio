const Migrations = artifacts.require("Migrations");
const Listings = artifacts.require("Listings");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Listings);
};
