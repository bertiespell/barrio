var express = require("express");
var router = express.Router();
var {
	Web3Storage,
	getFilesFromPath,
	makeStorageClient,
} = require("web3.storage");
var getDb = require("../orbitdb/orbit");

require("dotenv").config();

const storage = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });

/* Get a listing from web3.storage ipfs */
router.get("/", async function (req, res, next) {
	await retrieveAllFiles(req, res);
});

/* Get a listing from web3.storage ipfs */
router.get("/:cid", async function (req, res, next) {
	await retrieveFilesFromIpfs(req, res);
});

/* Store a new listing in web3.storage ipfs */
router.post("/", async function (req, res, next) {
	await storeFilesInIpfs(req, res);
});

async function storeFilesInIpfs(req, res) {
	try {
		const validatedRequest = validateRequest(req);

		if (!validatedRequest.valid) {
			res.send({
				status: false,
				message: validatedRequest.message,
			});
		} else {
			try {
				let fileData = [];

				const requestFiles = [req.files.listings]
					.flat()
					.map((listing) =>
						Object.assign(listing, { name: listing.name.trim() })
					);

				for (const file of requestFiles) {
					// move photo to uploads directory
					const path = "./uploads/" + file.name;

					file.mv(path);

					try {
						const pathFiles = await getFilesFromPath(path);
						fileData.push(...pathFiles);
					} catch (e) {
						res.status(500).send(err);
					}
				}

				let cid;
				try {
					cid = await storage.put(fileData);
				} catch (e) {
					res.status(500).send(err);
				}

				// Add to OrbitDB - using key-value store, where cid is the key
				const db = await getDb();

				try {
					const metadata = {
						price: req.body.price,
						title: req.body.title,
						description: req.body.description,
						location: req.body.location,
						imageFilesCID: cid,
						offersMade: [],
					};
					const orbitID = await db.put(cid, metadata);

					res.send({
						status: true,
						message: "Files are uploaded with cid: " + cid,
						imageFilesCID: cid,
						orbitID: orbitID,
						data: metadata,
					});
				} catch (e) {
					res.status(500).send(err);
				}
			} catch (err) {
				res.status(500).send(err);
			}
		}
	} catch (err) {
		res.status(500).send(err);
	}
}

async function retrieveFilesFromIpfs(req, res) {
	const cid = req.params.cid;

	if (!cid) {
		res.send({
			status: false,
			message: "No CID provided",
		});
	} else {
		try {
			const result = await storage.get(cid);
			console.log(
				`Got a response! [${result.status}] ${result.statusText}`
			);
			if (!result.ok) {
				throw new Error(`failed to get ${cid}`);
			}

			// unpack File objects from the response
			const files = await result.files();
			for (const file of files) {
				console.log(`${file.cid} -- ${file.name} -- ${file.size}`);
			}

			// Also send the metadata from OrbitDB
			const db = await getDb();
			const metadata = await db.get(req.params.cid);

			const responseData = {
				files,
				metadata,
			};

			res.send(responseData);
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	}
}

async function retrieveAllFiles(req, res) {
	const db = await getDb();
	const allListings = await db.all;
	res.send(allListings);
}

const validateRequest = (req) => {
	const validated = {
		valid: false,
		message: "",
	};
	if (!req.body) {
		validated.message = "No body provided";
		return validated;
	}

	if (!req.files || !req.files.listings) {
		validated.message = "No file uploaded";
		return validated;
	}

	if (!req.body.price) {
		validated.message = "No price provided";
		return validated;
	}

	if (!req.body.title) {
		validated.message = "No title provided";
		return validated;
	}

	if (!req.body.description) {
		validated.message = "No description uploaded";
		return validated;
	}

	if (!req.body.location) {
		validated.message = "No location uploaded";
		return validated;
	}

	return {
		valid: true,
	};
};

module.exports = router;
