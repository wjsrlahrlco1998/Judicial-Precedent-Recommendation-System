const express = require("express")
const app = express()
const path = require("path")
var db = require('./config/database')

const index = require('./routes/index')
const input = require('./routes/input')
const board = require('./routes/board')
const cases_board = require('./routes/cases_board')
const alert = require('./routes/alert')
const detail = require('./routes/detail')


// View Engine Setup
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static('web'))

app.use('/', index)
app.get('/input', input)
app.get('/board', board)
app.get('/alert', alert)
app.get('/detail', detail)
app.get('/cases_board', cases_board)

app.listen(8080,function(error) {
	if(error) throw error
		console.log("Server created Successfully on PORT 8080")
})