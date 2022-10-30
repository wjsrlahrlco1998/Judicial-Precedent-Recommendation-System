const express = require('express')
const router = express.Router()
const CaseController = require('../controller/db')


//html 파일 읽기
router.get('/board', CaseController.getCaseSearch)
router.get('/board/:casenumber', CaseController.getCaseAll)

module.exports = router;