var express = require('express')
const fs = require('fs')
const bodyParser = require('body-parser');

var app = express()

app.use(bodyParser.urlencoded({ extended: false }));


//save 버튼 클릭시 inputincident 파일 저장

module.exports.save = function(req, res) {
    var inputincidentTitle = req.body.inputincidentTitle + ".txt";
    var inputincidentText = req.body.inputincidentText;
    //uploads 폴더에 저장됨
    fs.writeFile('uploads/' + inputincidentTitle, inputincidentText, (err) => {
      if(err) {
        console.log(err);
      }
      res.redirect('/')
    })
  }