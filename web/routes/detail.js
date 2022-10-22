const express = require('express')
const router = express.Router()


//html 파일 읽기
router.get('/detail', (req, res) => {
	res.render('detail');
  })

module.exports = router;