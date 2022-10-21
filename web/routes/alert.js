const express = require('express')
const router = express.Router()


//html 파일 읽기
router.get('/alert', (req, res) => {
	res.render('alert');
  })

module.exports = router;