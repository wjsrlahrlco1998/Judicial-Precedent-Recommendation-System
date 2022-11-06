module.exports = {
    sim : function(string){
           //1.공백제거
           string = JSON.stringify(string);
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
      
}
