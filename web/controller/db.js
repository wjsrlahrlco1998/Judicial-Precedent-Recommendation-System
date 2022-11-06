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

    getCaseDetail: async(req,res) =>{
        const detailcase = await Case.getCaseDetail();
        if(!detailcase){
            res.send("Error");
        }else{
            res.send(detailcase);
        }
    },
}