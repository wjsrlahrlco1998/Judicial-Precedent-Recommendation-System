const Case = require('../models/cases_info')

module.exports = {
    getCaseSearch: async(req,res) =>{
        const searchcase = await Case.getCaseSearch();
        if(!searchcase){
            res.send("Error");
        }else{
            if (await Case.checkNumber(판례일련번호) != false)
                searchcase.유사도 = Case.checkNumber
            res.send(searchcase);
        }
    },

    getCaseAll: async(req,res) =>{
        const allcase = await Case.getCaseAll();
        if(!allcase){
            res.send("Error");
        }else{
            res.send(allcase);
        }
    },
}