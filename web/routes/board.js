const express = require('express')
const router = express.Router()


//html 파일 읽기
router.get('/board', (req, res) => {
	res.render('board');
  })

module.exports = router;