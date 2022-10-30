const multer = require("multer")
const storage = multer.memoryStorage();
const {spawn} = require('child_process');


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
    
	upload(req,res,function(err) {
		const file = req.file;
		if(err) {
			res.send(err)
		}

        else {
			const checked = req.body.type;
			const multerText = Buffer.from(file.buffer).toString("utf-8")
			const result = multerText
			const id = Math.random().toString(36).slice(2)
			
			
			var cases = {
				type : checked,
				content : result,
				id : id
			}

			var jsoncases = JSON.stringify(cases)

			// console.log(cases)
			console.log(jsoncases)

			const python = spawn('python', ['../../search_run.py', jsoncases]);

			python.stdout.on('data', (function(data){
                var textChunk = data.toString('utf8');
                console.log("return value: "+textChunk)
            }))
			
            res.redirect('/board')
        }
	})
}