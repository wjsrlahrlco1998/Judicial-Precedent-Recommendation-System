data = []
module.exports = {
    sim : function(string){
           
            string = string.replace(/\s/g,"")
            var reg = /[\{\}\[\]\/?;|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi

            if(reg.test(string)){

                string = string.replace(reg, "");    
            }
            string = string.replace("판례일련번호:","")
            string = string.replace("유사도:","")

            string = string.replace(/[0-9]*:/g,"")
            string = string.split(/,/g)


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
            
            string = string.replace(/\s/g,"")
            var reg = /[\{\}\[\]\/?;|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi 
            if(reg.test(string)){
                string = string.replace(reg, "");    
            }
           
            string = string.replace("사건명:", "");
            string = string.replace("판례일련번호:", "");
            string = string.replace("사건종류명:", "");
            string = string.replace("선고일자:", "");
           

            string = string.split(/,/g)
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
            return cases
        }

}