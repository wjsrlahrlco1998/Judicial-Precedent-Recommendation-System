const pool = require('../modules/pool.js');
const user = require('../controller/upload');
const table = 'case_info';

/*되는 코드
module.exports = {
    getCaseSearch :async function(){
        const sql = "select 사건번호 from caselaw3 where 판례일련번호 = '156163'"
        var result
        try{
                result  = pool.queryParam(sql);
                console.log("전달 받은 값 : " + result);

        } catch(err){
            console.log(err)
            throw err
        }
    }
}
*/

module.exports = {
    getCaseSearch :async function(){
        // 판례번호 많이 들어감
        const sql = "select 사건번호 from case_info where 판례일련번호 = 200321 "
        var result
        try{
                result  = await pool.queryParam(sql);
                result1 = JSON.stringify(result)
                console.log("전달 받은 값 : " + result1);
                console.log(user.upload)

        } catch(err){
            console.log(err)
            throw err
        }
    }
}