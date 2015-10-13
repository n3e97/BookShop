/*
* Created by zj on 2015/10/11
* */

var mysql=require("mysql");
var mysqlConfig=require("./config").mysql;
function mysqlClient(config){
    var pool = mysql.createPool(config);
    return {
        query:function(sql,options){
            return new Promise(function(resolve,reject){
                pool.query(sql,options, function (err, result) {
                    if(err){
                        reject(err);
                    }
                    else{
                        resolve(result);
                    }
                })
            });

        }
    }
}

exports.mysqlClient=mysqlClient(mysqlConfig);