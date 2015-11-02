/**
 * Created by zj on 2015/11/2.
 */

var userService=require("../lib/userService");

exports.adminRequired=function(req,res,next){
    var key=req.headers["cookie"];
    console.log(key);

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
             msg:"Î´Öª´íÎó"
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