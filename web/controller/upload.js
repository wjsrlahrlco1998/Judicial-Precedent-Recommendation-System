const multer = require("multer")
const storage = multer.memoryStorage();
const spawn = require('child_process').spawn;


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
			
			const id = Math.random().toString(36).slice(2)
			
			const python = spawn('python', ['../../py_modules/Jupyter_notebook/6. prec_compare_similarity.ipynb', req.body, result, id]);

            python.stdout.on('data', (function(chunk,error){
                if(error) console.log("Error",error)
                var textChunk = chunk.toString('utf8');
                console.log("return value: "+textChunk)
            }))

			/*
			console.log(req.body)
			console.log(result)
			console.log(id)
			*/
			
            res.redirect('/board')
        }
	})
}
