const similarity = require('../controller/similar.js')
const pool = require('../modules/pool.js');
const upload = require('../controller/upload')
const split = require('../controller/split');
const table = 'csvjson';



//주석 제외 실행됨

module.exports ={
    getCaseSearch : async function(){
        try{

            //여기서 판례일련번호를 이용하여 필요한데이터를 가져온다.

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
          str = upload.getData();
          //console.log("getData에서 가져오는 값 : ", str)


          //similarity.similar에서 유사도와 판례일련번호 값을 가져온다.
          var sim_result = await similarity.similar(str)
          var sim_result = JSON.stringify(sim_result);
          console.log("유사도 : ", sim_result)


          //split내에서 판례일련번호와 유사도 순으로 분리시켜준다.
          //split.sim()내의 매개변수로는 similarity.similar에서 구해진 결과를 넣어야한다.
          var splitData = await split.sim(sim_result)
        //   number = splitData[0]
          number = 1;
          sim = splitData[1]
          console.log("판례일련번호 : ", number, "유사도 : ", sim);

            //유사도와 판례일련번호 분할
            /*
            var string = "{'판례일련번호' : {'2941':150733,'18688': 150633,'12345': 77133},유사도:{'2941' : 56.6,'18688':50.0,'12345':50.1}"

            console.log("원래 string : ", string)
            string = string.replace(/\s/g,"")
            console.log("1. 제거후string : ", string);
            var reg = /[\{\}\[\]\/?;|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi


            if(reg.test(string)){
                string = string.replace(reg, "");
            }
            console.log("2. 제거후string : ", string);
            string = string.replace("판례일련번호:","")
            string = string.replace("유사도:","")
            console.log("3. 제거후string : ", string);

            string = string.replace(/[0-9]*:/g,"")
            string = string.split(/,/g)


            console.log("4. 제거후string : ", string);

            number = [];
            sim = [];
            for(i=0;i<string.length/2;i++){
                number[i] = string[i]
                sim[i] = string[i+string.length/2]
            }
            console.log("판례일련번호 : ", number)
            console.log("유사도 : ", sim)
            */
            //여기까지가 판례일련번호와 유사도 분할 코드

            //판례일련번호로 데이터베이스 select문 실행한다.
            const sql = `select 사건명,판례일련번호,선고일자,사건종류명  from ${table} where 판례일련번호 IN ( ${number} )`
            var result  = await pool.queryParam(sql);
            var jsonStr = JSON.stringify(result);


            //split.cases에서 하나의 배열에 [사건명, 판례일련번호, 선고일자, 사건종류명]만 나타나도록 한다.
            console.log("DB에서 전달 받은 값 : " + jsonStr);
            var casesStr = await split.cases(jsonStr)
            console.log("split에서 전달받은값 : " + casesStr)

            //유사도에 관한 정보를 allCases[0]내에 전부, 판례와관련된 내용 전부를 allCases[1]에 넣는다.
            var allCases = []
            allCases[0] = sim
            allCases[1] = casesStr

            return allCases
        } catch(err){
            console.log(err)
            throw err
        }
    }
    }