 /*
    created By zj on 2015/10/30
 */

var user_sign_service=require("../lib/userService").user_sign;
 exports.signIn=function(req,res){
     var obj={
         username:req.body.username,
         password:req.body.password
     };
     user_sign_service.signIn(obj).then(function(rt){
         return rt;
     }).catch(function(err){
         console.error(err.stack);
         return {
             result:3,
             msg:"Unknown Error Occured!"
         };
     }).then(function(r){
         if(r.result==0){
             res.cookie("key", r.key,{expires: new Date(Date.now() +1000*60*60*12)})
         }
         res.json(r);
     });
 }

 exports.signUp=function(req,res){
      Promise.resolve().then(function(){
          var obj={
              username:req.body.username,
              email:req.body.email,
              address:req.body.address,
              phone:req.body.phone
          };
          user_sign_service.signUp(obj).then(function(rt){
              return rt;
          });
      }).catch(function(err){
          console.error(err.satck);
          return {
              result:2,
              msg:"Î´Öª´íÎó"
          };
      }).then(function(r){
          res.json(r);
      });
 }
 exports.reset_password=function(req,res){
        //TO DO
     res.end();
 }