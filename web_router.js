var express=require("express");
var router=express.Router();
var sign=require("./routes/sign.js");
var upload=require("./routes/upload.js")
var book=require("./routes/book.js");
var auth=require("./routes/auth.js");
var userService=require("./lib/userService");

router.get("/",function(req,res,next){
    res.redirect("/public/html/index.html");
});
router.get("/logout",function(req,res,next){
     res.clearCookie("key");
     res.redirect("/public/html/index.html");
});
router.get(/\/activate{1}.*/,function(req,res,next){
    console.log("activated ");
     userService.user_auth.verifyEmailLink(req.url).catch(function(err){
         console.error(err.stack);
         return {
             result:3,
             msg:"激活账户失败"
         }
     }).then(function(rt){
         res.json(rt);
     });
});

router.get("/get_star_book",book.starBook);
router.get("/getindexbookinfo",book.indexBook);
router.post("/login",sign.signIn);
router.post("/register",sign.signUp);
router.post("/getbookinfo",book.returnBookInfo);
router.post("/search_book",book.searchBook);

router.use("/",auth.userRequired);

router.post("/reset_password",sign.reset_password);
router.post("/buy_book",book.buy_book);
router.get("/submit_orders",book.submit_orders);
router.get("/get_order_temp",book.returnTempOrder);
router.post("/upload_img",auth.adminRequired,upload.recieve_img);
router.post("/remove_img",auth.adminRequired,upload.remove_img);
router.post("/new_book",auth.adminRequired,book.newBook);

module.exports=router;