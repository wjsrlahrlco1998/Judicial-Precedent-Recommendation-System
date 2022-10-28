const pool = require('../modules/pool');
const table = 'cases_info';
const spawn = require('child_process').spawn;

// python에서 판례일련번호와 유사도를 받아옴
const result = spawn('python', ['../../py_modules/7. python_modules_test.ipynb']);

result.stdout.on('data', function(data) {
    JSON.parse(data);
    console.log(data.toString());
});


const cases_info = {
    // 검색에 필요한 요소
    getCaseSearch: async (판례제목, 판례일련번호, 선고날짜, 사건종류) => {
        const fields = '판례제목, 핀례일련번호, 선고날짜, 사건종류';
        const query = `SELECT ${fields} FROM ${table} WHERE 판례일련번호 = "${data.판례일련번호}"`;
        try {
            return await pool.queryParam(query);
        } catch(err){
            console.log('getCasesSearch err : ', err);
            throw err;
        }
    },
    
    // 상세보기에 필요한 요소
    getCasesAll: async ()=>{
        const query = `SELECT * FROM ${table} WHERE 판례일련번호 = "${data.판례일련번호}"`;
        try{
            return await pool.queryParam(query);
        } catch(err){
            console.log('getCasesAll err : ', err);
            throw err;
        }
    }
}

module.exports = cases_info;