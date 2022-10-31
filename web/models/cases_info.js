const db = require('../config/database');
const pool = require('../modules/pool')
const table = 'cases_info';
const python1 = require('../controller/upload')

const data = python1.upload


// result를 비동기로 불어온다면!! await.poolParam(sql) 먼저 시작 후 console.log가 찍힌다면,,~
module.exports = {
    getCaseSearch : async function(판례제목, 판례일련번호, 선고날짜, 사건종류){
        const sql = `SELECT * FROM ${table} WHERE 판례일련번호 = '220263'`;
        var result
        try{
                result  = await pool.queryParam(sql);
                console.log("전달 받은 값 : " + result);

        } catch(err){
            console.log(err)
            throw err
        }
    }

    
}



/*
//const sql = "select 사건번호 from cases_info where 판례일련번호 = '156163'"
var result




const cases_info = {
    // 검색에 필요한 요소
    getCaseSearch: async (판례제목, 판례일련번호, 선고날짜, 사건종류) => {
        try{
            result  = pool.queryParam(sql);
           console.log("전달 받은 값 : " + result);
            return await result
   } catch(err){
       console.log(err)
       throw err
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



// module.exports = cases_info;

*/