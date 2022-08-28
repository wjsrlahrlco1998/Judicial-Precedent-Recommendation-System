const multer = require("multer")
const storage = multer.memoryStorage();

const filefilter = (req, file, cb) => {
    if (file.mimetype == 'text/plain') { // checking the MIME type of the uploaded file
        cb(null, true);
    } else {
        cb(null, false);
    }
}

var upload = multer({
    filefilter,
    storage: storage,
}).single("case");


module.exports.upload = function(req, res, next) {
    const { checked } = req.body

	upload(req,res,function(err) {
		const file = req.file;
		if(err) {
			res.send(err)
		}

        else {
			const multerText = Buffer.from(file.buffer).toString("utf-8")

			const result = {
				fileText: multerText,
			  }

			console.log(req.body)
			console.log(result)
            res.redirect('/board')
        }
	})
}
