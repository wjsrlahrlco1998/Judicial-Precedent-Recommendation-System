
const Incidents = require('../index.js')
const express = require('express')
const router = express.Router()
const multer = require("multer")



var upload = require('../controller/upload')
var input = require('../controller/input')


router.get('/', (req, res) => {
	res.render('index')
  })


router.post('/upload', upload.upload)
router.post('/save', input.save)

module.exports = router;