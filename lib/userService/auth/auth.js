/**
 * Created by zj on 2015/10/11.
 */
var tools=require("../../tools");
var userModel=require("../model");

var verify=function(username,key){
    return Promise.resolve().then(function(){
        return userModel.getUserInfo(username).then(function(result){
          return ;// to do :返回password
        });

    }).then(function(password){
        var timestamp1=tools.getTimeStamp(key);
        var timestamp2=tools.jieMa(timestamp1);
        var key2=tools.md5Update(password+timestamp2)+timestamp1;
        var is_timeout=tools.isTimeout(timestamp2);
        if(key==key2&&!is_timeout){
            return {
                "result":0,
                "message":"ok"
            };
        }else if(is_timeout){
            return {
                "result":3,
                "message":"Timeout !"
            };
        }else{
            return {
                "result":1,
                "message":"Failed to verify !"
            };
        }
    }).catch(function(err){
        console.error(err.stack);
        return {
            "result":1,
            "message":"Failed to verify !"
        };
    });
}

exports.auth=function(key,username){
    return verify(username,key);
}

exports.verifyEmailLink=function(url){
    var temp=url.split("/");
    var username=temp[2];
    var key=temp[3];
    return verify(username,key).then(function(result){
        if(result.result===0){
            userModel.activateAccount(username);//激活账户
        }
        return result;
    });
}