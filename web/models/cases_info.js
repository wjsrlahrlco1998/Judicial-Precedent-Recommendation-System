const similarity = require('../controller/similar.js')
const pool = require('../modules/pool.js');
const upload = require('../controller/upload')
const table = 'cases_info';


//주석 제외 실행됨

module.exports ={
    getCaseSearch : async function(){
        try{
            
            //여기서 판례일련번호를 이용하여 필요한데이터를 가져온다.

            str = upload.getData();
            console.log("getData에서 가져오는 값 : ", str)

            var sim_result = await similarity.similar(str)
            console.log("유사도 : ", sim_result)

            const sql = `select 사건번호 from ${table} where 판례일련번호 = '220263'`
            var result  = await pool.queryParam(sql);
            var jsonStr = JSON.stringify(result);
            console.log("DB에서 전달 받은 값 : " + jsonStr);
            
        } catch(err){
            console.log(err)
            throw err
        }
    }
}