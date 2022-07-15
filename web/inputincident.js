const express = require("express")
const app = express()
const bodyParser = require('body-parser');
const path = require("path")
const fs = require('fs')

	
// View Engine Setup
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")

app.use(bodyParser.urlencoded({ extended: false }));

app.locals.pretty = true;
	

//html 파일 읽기
app.get('/', (req, res) => {
	res.render('inputincident');
  })

//save 버튼 클릭시 inputincident 파일 저장
app.post("/save", (req, res) => {
  var inputincidentTitle = req.body.inputincidentTitle + ".txt";
  var inputincidentText = req.body.inputincidentText;
  //uploads 폴더에 저장됨
  fs.writeFile('uploads/' + inputincidentTitle, inputincidentText, (err) => {
    if(err) {
      console.log(err);
    }
    res.send("파일 다운 완료");
  })
})
	
app.listen(8080,function(error) {
	if(error) throw error
		console.log("Server created Successfully on PORT 8080")
})