var express=require("express");
var router=express.Router();
var sign=require("./routes/sign.js");

router.get("/",function(req,res,next){
    res.redirect("/public/html/index.html");
});

router.post("/login",sign.signIn);
router.post("/register",sign.signUp);
router.post("/reset_password",sign.reset_password);
module.exports=router;