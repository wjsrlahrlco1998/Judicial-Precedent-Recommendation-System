const multer = require("multer")
const storage = multer.memoryStorage();
//const {spawn} = require('child_process');
const { resolve } = require("path");
const { setEnvironmentData } = require("worker_threads");
//const similar =require('./similar.js')
//const pool = require('../modules/pool.js')


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


var exports = module.exports = {};

exports.upload = function(req, res, next) {
    upload(req,res,function(err) {
		const file = req.file;
		if(err) {
			res.send(err)
		}

        else {
			const checked = req.body.type;
			const result = Buffer.from(file.buffer).toString("utf-8")
			//global.result = result

			const id = Math.random().toString(36).slice(2)

			// let dataString;
			var cases = {
				type : checked,
				content : result,
				id : id
			}

			var jsoncases = JSON.stringify(cases)
			global.jsoncases=jsoncases
			//console.log(jsoncases)

			res.redirect('/boards' )
			//})
			}

		})

}

exports.getData = function(){
	//console.log("result : ",jsoncases)
	return jsoncases;
}