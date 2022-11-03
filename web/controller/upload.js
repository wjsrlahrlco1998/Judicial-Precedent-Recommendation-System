const multer = require("multer")
const storage = multer.memoryStorage();
const iconv = require('iconv-lite');
let rs

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
			// console.log(jsoncases)
			const spawn = require('child_process').spawn;
			const process = spawn('python', ['search_run.py', jsoncases]);
			
			// 한글 깨짐 해결
			// 결과 데이터 -> cases_info로 넘겨주기
			// 필요한것만 쪼개서 Query
            process.stdout.on('data', function (data) {
				rs = iconv.decode(data, 'euc-kr');
    			console.log(rs);
				//console.log(data.toString())
            });
			
			// console.log(jsoncases)
			// console.log(textChunk)
            res.redirect('/board')
        }
	})
	return rs
}