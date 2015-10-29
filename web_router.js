var express=require("express");
var router=express.Router();

router.get("/",function(req,res,next){
    res.redirect("/public/html/index.html");
});


module.exports=router;