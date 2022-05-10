var express = require("express");
var router = express.Router();
var {
	Web3Storage,
	getFilesFromPath,
	makeStorageClient,
} = require("web3.storage");

require("dotenv").config();

const storage = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });

async function storeFilesInIpfs(req, res) {
	try {
		// TODO: add request validation for metadata fields
		if (!req.files.listings) {
			res.send({
				status: false,
				message: "No file uploaded",
			});
		} else {
			try {
				let data = [];

				for (const file of req.files.listings) {
					// move photo to uploads directory
					const path = "./uploads/" + file.name;
					file.mv(path);

					const pathFiles = await getFilesFromPath(path);
					data.push(...pathFiles);
				}

				const cid = await storage.put(data);

				// Add to OrbitDB - using key-value store, where cid is the key
				// await db.put(cid, {
				//     price: uint,
				//     title: string,
				//     description: string,
				//     imageFiles: string[], // this is of the hashes
				//     offersMade: string[] // user hash
				// })

				res.send({
					status: true,
					message: "Files are uploaded with cid:" + cid,
					data: data,
				});
			} catch (err) {
				res.status(500).send(err);
			}
		}
	} catch (err) {
		res.status(500).send(err);
	}
}

async function retrieveFilesFromIpfs(req, res) {
	const cid = req.body.cid;

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
			res.send(files);
		} catch (err) {
			console.log(err);
			res.status(500).send(err);
		}
	}
}

/* Get a listing from ipfs */
router.get("/", async function (req, res, next) {
	await retrieveFilesFromIpfs(req, res);
});

/* Store a new listing in ipfs */
router.post("/", async function (req, res, next) {
	await storeFilesInIpfs(req, res);
});

module.exports = router;
