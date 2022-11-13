const mysql = require('../config/database');
/*
module.exports = {
    queryParam : function(query){
        mysql.getConnection((err,connection)=>{
            if(err) throw err;
            console.log("connection_pool GET");

            res = connection.query(query, (err, result, fields)=>{ // Query문 전송
                if(err) {
                    console.log(err)    
                    throw error
                }
                else{
                    console.log(result)
                    return result
                    }
                }
            );
            connection.release(); // Connectino Pool 반환
        })
    }
}
*/

module.exports = {
    queryParam : function(query){
        return new Promise((resolve, reject) => {
            mysql.getConnection((err,connection)=>{
                if(err) throw err;
                console.log("connection_pool GET");
    
                res = connection.query(query, (err, result, fields)=>{ // Query문 전송
                    if(err) {
                        console.log(err)    
                        throw error
                    }
                    else{
                        // console.log(result)
                        resolve(result)
                        }
                    }
                );
                connection.release(); // Connectino Pool 반환
            })
        })
    }
        
}