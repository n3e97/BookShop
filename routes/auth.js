/**
 * Created by zj on 2015/11/2.
 */

var userService=require("../lib/userService");

exports.adminRequired=function(req,res,next){
    var cookie=unescape(req.headers["cookie"]);
    var username=cookie.split("&&")[1];
    userService.user_auth.isAdmin(username).then(function(tf){
        if(tf){
            next();
        }else{
            res.json({
                result:2,
                msg:"您没有管理员权限"
            });
        }
    })
}

exports.userRequired=function(req,res,next){
    console.log(req.url);
     var cookie=unescape(req.headers["cookie"]);
     var key=cookie.split("&&")[0],
         username=cookie.split("&&")[1];
     userService.user_auth.auth(key,username).then(function(rt){
         return rt;
     }).catch(function(err){
         console.error(err.stack);
         return {
             result:3,
             msg:"未知错误"
         }
     }).then(function(rt){
         console.log(rt);
         if(rt.result==0){
             next();
         }else{
             res.json(rt);
         }
     });
}