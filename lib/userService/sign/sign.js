/*
* Created by zj on 2015/10/11
* */

var userModel=require("./model");
var auth=require("./auth");
var tools=require("../../tools");

exports.signUp=function(userinfo){
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
        return userModel.newUser(username,email,password,phone,address).then(function(result){
            var link="http://121.42.202.11:9000/activate/"+username+"/"+auth.createKey(password);
            return tools.sendActivationEmail(username,link).then(function(res){
                return {
                    result:0,
                    "message":"激活连接已经发至您的邮箱，请于俩小时内激活"
                };
            }).catch(function(er){
                console.error(er.stack);
                return {
                    result:1,
                    "message":"发送激活邮件失败，请确认您的邮箱是否正确"
                };
            })
        }).catch(function(err){
            console.error(err.stack);
            err.result=1;
            err.message="账户创建失败，请重试";
            throw err;
        });
    }).catch(function(r){
        if(r.result!==undefined){
            return {
                result: r.result,
                message: r.message
            };
        }else{
            return {
                result:1,
                message:"未知错误,注册失败"
            };
        }
    });
}

exports.signIn=function(userinfo){
    var username=userinfo.username,
        password=userinfo.password;
    return Promise.resolve().then(function(){
        return userModel.getUserInfo(username).then(function(res){
            return ;//to do ;return password;
        });
    }).then(function(pass){
        if(pass===undefined){
            return {
                "result":1,
                "message":"该用户不存在"
            };
        }else if(pass!==password){
            return {
                "result":1,
                "message":"密码不正确"
            };
        }else {
            return {
                "result":0,
                "message":"登陆成功",
                "key":tools.createKey(password)
            };
        }
    }).catch(function(err){
        console.error(err.stack);
        return {
            "result":1,
            "message":"非常抱歉，出现未知错误，登陆失败"
        };
    });
}