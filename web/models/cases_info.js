const similarity = require('../controller/similar.js')
const pool = require('../modules/pool.js');
const upload = require('../controller/upload')
const split = require('../controller/split');
const table = 'case_info';
//주석 제외 실행됨

module.exports ={
    getCaseSearch : async function(request, response){
        try{
            /*
            1. spawn과 관련된 내용을 similar.js파일에서 처리
            2. upload에 있는 spawn과 관련된 내용 삭제
            3. upload에서는 업로드 된 파일을 받는 역할
            4. upload에서 업로드 된 파일과 관련된 내용을 전역변수화(global.jsoncases)
            5. upload에 getData라는 파일과 관련된 내용을 가져오는 함수 설정
            6. cases_info에서 upload.getData를 불러 json형태로된 사건과 관련된 내용 가져옴
            7. cases_info에서 similar파일 내의함수 similar를 사건과 관련된 내용을 이용하여 호출
            8. similar에서 spawn 수행
            9. similar에서 유사도 반환
            10. 유사도 받은 후 sql실행
            */
            //사건 내용을 가져온다.
            case_contents = upload.getData();


            //similarity.similar에서 유사도와 판례일련번호 값을 가져온다.
            //similar.js내의 함수 similar를 similarity로 바꾸어주었다.
            var sim_result = await similarity.get_similarity(case_contents)

            //split내에서 판례일련번호와 유사도 순으로 분리시켜준다.
            //분리된 내용을 number와 sim에 넣는다.(number에는 판례일련번호, sim에는 유사도)
            //split.sim()내의 매개변수로는 similarity.similarity에서 구해진 결과를 넣어야한다.
            var splitData = await split.sim(sim_result)
            number = splitData[0]
            sim = splitData[1]

            //제대로 들어가는지 확인
            console.log("판례일련번호 : ", number, "유사도 : ", sim);


            //판례일련번호로 데이터베이스 select문 실행한다.
            //판례일련번호 in(number)를 사용할 거면 판례일련번호의 형태가 int형이어야 한다.
            //만약 판례일련번호가 string 형태라면 판례일련번호 in ( number)구분이 오류가 나 실행 되지 않는다.
            const sql = `select * from ${table} where 판례일련번호 IN( ${number} );`
            var result  = await pool.queryParam(sql);

            sim_index = sim.length; // 유사도의 길이를 확인(json형태)
            sim_index = JSON.stringify(sim_index); // json형태의 sim_index를 string형태로 변환

            //json형태의 result에 유사도를 추가하여 유사도 항목에 sim을 넣는다(sim : 유사도)
            for(i = 0; i < Number(sim_index) ; i++)
            result[i].유사도 = sim[i]

            //json형태로 반환해준다.
            return result

        } catch(err){
            console.log(err)
            throw err
        }
    },


    getCaseDetail : async function(){
        try{

            /*
            1. getCaseAll -> getCaseDetail
            2. 웹(프엔)에서 다운로드 버튼을 클릭하면 해당 행의 판례일련번호를 받아옴 -> sql 구문 실행
            3. 판례 상세보기에 ++(유사도)도 함께 보여주는 게 좋을ㄲ/ㅏ?
            */

            casenumber = req.body.case;

            const sql = `select * from ${table} where 판례일련번호 IN ( ${casenumber} )`
            var result  = await pool.queryParam(sql);

            return result

        } catch(err){
            console.log(err)
            throw err
        }
    }
}