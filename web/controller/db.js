const Case = require('../models/cases_info')

module.exports = {
    getCaseSearch: async(req,res) =>{
        const searchcase = await Case.getCaseSearch();
        console.log("cases_info에서 받은 내용 : ", searchcase)
        if(!searchcase){
            res.send("Error");
        }else{
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