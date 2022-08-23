const multer = require("multer")

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'text/plain') { // checking the MIME type of the uploaded file
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    fileFilter,
    storage
}).single("case");




module.exports.upload = function(req, res, next) {
    const { checked } = req.body
    const file = req.file;
	console.log(req.file)


	if (!file) {
		const error = new Error("Please upload a file");
		error.httpStatusCode = 400;
		return next(error);
	  } 
	  const multerText = Buffer.from(file.buffer).toString("utf-8");
	
	  const result = {
		fileText: multerText,
	  };

	  res.redirect('/board')
	  console.log(req.body)
	  console.log(result)
	};
	
