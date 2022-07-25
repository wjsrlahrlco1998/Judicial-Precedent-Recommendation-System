const multer = require("multer")

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



module.exports.upload = function(req, res) {
	const { checked } = req.body

	upload(req,res,function(err) {

		if(err) {
			res.send(err)
		}
        else {
            // db 연결해서 그...... db로 값 전달
			console.log(req.body)
            res.redirect('/board')
            // 알림창으로 어디 다운받았는지 확인
        }

		})
    }