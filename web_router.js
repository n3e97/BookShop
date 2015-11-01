var express=require("express");
var router=express.Router();
var sign=require("./routes/sign.js");
var upload=require("./routes/upload.js")
var book=require("./routes/book.js");

router.get("/",function(req,res,next){
    res.redirect("/public/html/index.html");
});

router.post("/login",sign.signIn);
router.post("/register",sign.signUp);
router.post("/reset_password",sign.reset_password);
router.post("/upload_img",upload.recieve_img);
router.post("/remove_img",upload.remove_img);
router.post("/new_book",book.newBook);
module.exports=router;