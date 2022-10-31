const Case = require('../models/cases_info')

module.exports = {
    getCaseSearch: async(req,res) =>{
        const searchcase = await Case.getCaseSearch();
        if(!searchcase){
            res.send("Error");
        }else{
           /* if (await Case.checkNumber(판례일련번호) != false)
                searchcase.유사도 = Case.checkNumber */
            console.log(searchcase)
            res.send(searchcase);
        }
    },

    getCasesAll: async(req,res) =>{
        const allcase = await Case.getCasesAll();
        if(!allcase){
            res.send("Error");
        }else{
            res.send(allcase);
        }
    },
}