var express = require('express');
var router = express.Router();
var { Web3Storage, getFilesFromPath } = require('web3.storage');

require('dotenv').config()

const storage = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })

async function storeFilesInIpfs(req, res) {
    try {
        if(!req.files.listings) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            try {
                let data = []; 

                for (const file of req.files.listings) {
                    //move photo to uploads directory
                    const path = './uploads/' + file.name
                    file.mv(path);

                    const pathFiles = await getFilesFromPath(path)
                    data.push(...pathFiles)
                }

                const cid = await storage.put(data)

                res.send({
                    status: true,
                    message: 'Files are uploaded with cid:' + cid,
                    data: data
                });
            } catch (err) {
                console.log(err)
                res.status(500).send(err);
            }
            
        }
    } catch (err) {
        res.status(500).send(err);
    }
}

async function main () {
  const storage = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN })
  const files = []

  for (const path of ["./test.png"]) {
    const pathFiles = await getFilesFromPath(path)
    files.push(...pathFiles)
  }

  console.log(`Uploading ${files.length} files`)
  const cid = await storage.put(files)
  console.log('Content added with CID:', cid)
  return cid;
}

/* GET ipfs listing. */
router.get('/', async function(req, res, next) {
  const cid = await main();
  res.send(cid);
});

router.post('/', async function(req, res, next) {
    await storeFilesInIpfs(req, res);
});

module.exports = router;
