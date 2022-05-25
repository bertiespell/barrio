const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");

// This just needs to be run once to create the DB locally
// Otherwise we connect to an existing one
async function main() {
	// Create IPFS instance
	const ipfsOptions = { repo: "./ipfs" };
	const ipfs = await IPFS.create(ipfsOptions);

	// Create OrbitDB instance
	const orbitdb = await OrbitDB.createInstance(ipfs);

	// Create database instance
	const options = {
		accessController: {
			write: [
				// Give access to ourselves
				orbitdb.identity.id,
			],
		},
		// overwrite: true,
		// replicate: false,
		// meta: { hello: "meta hello" },
	};
	const db = await orbitdb.keyvalue("listings-database", options);
	console.log(db.address.toString(), "Db address");
	const identity = db.identity;
	console.log(identity.toJSON(), "DB identity");
	process.exit();
}

main();
