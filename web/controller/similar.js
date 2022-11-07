const {spawn} = require('child_process');
const { resolve } = require("path");
const iconv = require('iconv-lite');
//const fileUpload = require('./upload.js')



module.exports= {
	//similar: async function(req, res, next, err){
		get_similarity:function(data){
			return new Promise(async function(resolve, reject) {
			setTimeout(function(){	
				const python = spawn('python', ['search_run.py', data]);
			
				python.stdout.on('data', (async function(data){
					//문자화
					
					var dataString = iconv.decode(data, 'euc-kr')
					var dataString = dataString.toString()
					//'[',']' 문자열 삭제 밑 구분자 ','를 이용하여 문자열 분할
					var str = dataString.replace("[","");
					var str = str.replace("]","");
					var str = str.split(',');
					//console.log("upload : ", str[0], str[1])
					resolve(str)
				}))
			})
		}) //promise
	} //function
} //export
