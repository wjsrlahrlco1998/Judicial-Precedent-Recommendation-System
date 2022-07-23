

const express = require("express")
const app = express()
const path = require("path")
const multer = require("multer")
const index = require('./routes/index')

	
// View Engine Setup
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use('/', index)
	


	
var storage = multer.diskStorage({
	destination: function (req, file, cb) {

		// Uploads is the Upload_folder_name
		cb(null, "uploads")
	},
	filename: function (req, file, cb) {
	cb(null, file.fieldname + "-" + Date.now()+".txt")
	}
})
	

var upload = multer({
	storage: storage,
	
  /*fileFilter: function (req, file, cb){
	
		// Set the filetypes, it is optional
		var filetypes = /txt/;
		var mimetype = filetypes.test(file.mimetype);

		var extname = filetypes.test(path.extname(
					file.originalname).toLowerCase());
		
		if (mimetype && extname) {
			return cb(null, true);
		}
	
		cb("Error: File upload only supports the "
				+ "following filetypes - " + filetypes);
	}*/ 

}).single("case");	


app.post("/upload",function (req, res, next) {
	const { checked } = req.body

	upload(req,res,function(err) {

		if(err) {
			res.send(err)
		}
		else {
			// db 연결해서 그...... db로 값 전달
			console.log(req.body)
		}
		res.redirect('/')
	})
})
	

app.listen(8080,function(error) {
	if(error) throw error
		console.log("Server created Successfully on PORT 8080")
})