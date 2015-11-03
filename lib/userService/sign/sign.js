/*
* Created by zj on 2015/10/11
* */

var userModel=require("../model");
var auth=require("../auth");
var tools=require("../../tools");

exports.signUp=function(info){
    var username=info.username,
        password=info.password,
        email=info.email,
        phone=info.phone,
        address=info.address;
    return Promise.resolve().then(function(){
       return userModel.checkExist(username,email,phone).then(function(result){
           if(result.exist){
               var err=new Error(result.message);
               err.result=1;
               throw err;
           }else{
               return ;
           }
       });
    }).then(function(){
        return userModel.newUser(username,email,password,phone,address).then(function(){
            var link="http://111.117.104.113:9000/activate/"+username+"/"+tools.createKey(password);
            return tools.sendActivationEmail(email,username,link).then(function(){
                return {
                    result:0,
                    "msg":"激活连接已经发至您的邮箱，请于俩小时内激活"
                };
            }).catch(function(er){
                console.error(er.stack);
                return {
                    result:1,
                    msg:"发送激活邮件失败，请确认您的邮箱是否正确"
                };
            })
        });
    }).catch(function(err){
        console.error(err.stack);
        if(err.result!==undefined){
            return {
                result: err.result,
                msg: err.message
            };
        }else{
            return {
                result:1,
                msg:"未知错误,注册失败"
            };
        }
    });
}

exports.signIn=function(userinfo){
    var username=userinfo.username,
        password=userinfo.password;
    return Promise.resolve().then(function(){
        return userModel.getUserInfo(username).then(function(res){
            return res[0];//to do ;return password;
        });
    }).then(function(rt){
        var pass=rt.password;
        if(rt.is_activated==0){
            return {
                result:1,
                msg:"账户未激活"
            };
        }else if(pass===undefined){
            return {
                "result":1,
                "msg":"该用户不存在"
            };
        }else if(pass!==password){
            return {
                "result":1,
                "msg":"密码不正确"
            };
        }else {
            return {
                "result":0,
                "msg":"登陆成功",
                "key":tools.createKey(password)+"&&"+username
            };
        }
    }).catch(function(err){
        console.error(err.stack);
        return {
            "result":1,
            "msg":"非常抱歉，出现未知错误，登陆失败"
        };
    });
}