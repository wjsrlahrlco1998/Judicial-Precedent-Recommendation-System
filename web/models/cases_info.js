const pool = require('../modules/pool');
const table = 'case_info';
const spawn = require('child_process').spawn;

// python에서 판례일련번호와 유사도를 받아옴
const result = spawn('python', ['../../search_run.py']);

result.stdout.on('data', function(data) {
    JSON.parse(data);
    console.log(data.toString());
});


const cases_info = {
    // 검색에 필요한 요소
    getCaseSearch: async (판례제목, 판례일련번호, 선고날짜, 사건종류) => {
        const fields = '판례제목, 판례일련번호, 선고날짜, 사건종류';
        const number = '판례일련번호'
        const query = `SELECT ${fields} FROM ${table} WHERE 판례일련번호 = "${data.판례일련번호}"`;
        try {
            return await pool.queryParam(query);
        } catch(err){
            console.log('getCasesSearch err : ', err);
            throw err;
        }
    },
    
    checkNumber: async (판례일련번호) => {
        const query = `SELECT * FROM ${table} WHERE id="${data.판례일련번호}"`;
        try {
            const result = await pool.queryParam(query);
            if (result == data.판례일련번호) return data.유사도;
            else return false;
        } catch (err) {
            console.log('checkNumber ERROR : ', err);
            throw err;
        }
    },

    getCaseByCasenumber: async (판례일련번호) => {
        // query문 작성 
        const query = `SELECT * FROM ${table} WHERE 판례일련번호="${data.판례일련번호}"`;
        // pool module로 전달해서 결과값 받기
        // try - catch로 ERROR 받기
        try {
            return await pool.queryParam(query);
        } catch (err) {
            console.log('getCaseByCasenumber ERROR : ', err);
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