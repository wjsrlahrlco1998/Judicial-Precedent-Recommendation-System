const spawn = require("child_process").spawn;
const json = '{"result":123, "count":42}';

var process = spawn("python", ["test.py", json]);

console.log(json)

process.stdout.on("data", function (data) {
  console.log(data.toString());
}); // 실행 결과

process.stderr.on("data", function (data) {
  console.error(data.toString());
}); // 실행 >에러