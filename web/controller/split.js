var string = ["{'판례일련번호' : {'2941':150733,'18688': 150633,'12345': 77133},유사도:{'2941' : 56.6,'18688':50.0,'12345':50.1}\r\n"]
//var string = [{"사건명":"차량인도가처분결정에대한재항고","판례일련번호":"150633","선고일자":"1962-01-18","사건 종류명":"민사"},{"사건명":"면직처분취소","판례일련번호":"150733","선고일자":"1962-02-15","사건종류명":"일반행정"},{"사건명":"급수료청구사건","판례일련번호":"77133","선고일자":"1962-11-30","사건종류명":"민사"}]
var string = JSON.stringify(string);
 

module.exports = {
    sim : function(string){
           //1.공백제거
            string = string.replace(/\s/g,"")
            //,
            var reg = /[\{\}\[\]\/?;|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi

            if(reg.test(string)){

                string = string.replace(reg, "");    
            }
            string = string.replace("판례일련번호:","")
            string = string.replace("유사도:","")

            string = string.replace(/[0-9]*:/g,"")
            
            string = string.replace("rn","")
            string = string.split(/,/g)

            data = [];
            number = [];
            sim = [];
            for(i=0;i<string.length/2;i++){
                number[i] = string[i] 
                sim[i] = string[i+string.length/2]
            }
            data[0] = number;
            data[1] = sim;

            return data;
        },
        
        cases : function(string){
            var string = JSON.stringify(string);
            console.log("1.기본 string :\n", string)
            string = string.replace(/\s/g,"")
                       string = string.split(/},/g)
                       index = string.length
                       var string = JSON.stringify(string);
            
                       var reg = /[\{\}\[\]\/?;|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi 
                        if(reg.test(string)){
                            string = string.replace(reg, "");    
                        }
                        console.log("2.변환 후 string : ", string)
                        console.log("string 길이 : " , )
                        for(i = 0; i<index ; i++){
                        
                        string = string.replace("사건명:", "");
                        string = string.replace("판례일련번호:", "");
                        string = string.replace("사건종류명:", "");
                        string = string.replace("선고일자:", "");
                        
                        }
                      
                        console.log("3.변환 후 string : ", string)
                       
                        string = string.split(/,/g)
                        console.log("4.변환 후 string : ", string)
                        const cases = []
                        caseTitle = []
                        caseNumber = []
                        caseType = []
                        caseDate = []
                        for(i=0,j=0;i<string.length;i = i + 4,j++){
                            caseTitle[j] = string[i]
                            caseNumber[j] = string[i+1]
                            caseType[j] = string[i+2]
                            caseDate[j] = string[i+3]
            
                        }
                        
                        console.log(caseTitle.length)
                        for(i=0;i<caseTitle.length; i++){
                           
                           cases.push([caseTitle[i],caseNumber[i],caseType[i],caseDate[i]])
                        }
                        console.log("5. 최종 string : ",cases)
            
            return cases
        }

}
