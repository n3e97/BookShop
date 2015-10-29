var express=require("express");
var router=express.Router();

router.get("/",function(req,res,next){
    res.redirect("/public/html/index.html");
   // res.redirect('https://www.baidu.com/');
});

router.post("/login",function(req,res,next){
    console.log(req.body);
    res.json({msg:"ok",result:0});
});
router.post("/register",function(req,res,next){
   console.log(req.body);
    res.json({"result":2,"msg":"regist ok"});
});
router.post("/reset_password",function(req,res,next){

});
module.exports=router;