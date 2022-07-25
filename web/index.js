const express = require("express")
const app = express()
const path = require("path")


const index = require('./routes/index')
const input = require('./routes/input')

	
// View Engine Setup
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/', index)
app.get('/input', input)


app.listen(8080,function(error) {
	if(error) throw error
		console.log("Server created Successfully on PORT 8080")
})