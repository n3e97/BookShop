/**
 * Created by zj on 2015/10/31.
 */
var bookService=require("../lib/bookService");

exports.newBook=function(req,res,next){
    var book_name=req.body.book_name,
        book_author=req.body.book_author,
        book_price=req.body.book_price,
        book_publisher=req.body.book_publisher,
        book_banben=req.body.banben,
        book_img=req.body.book_img,
        book_num=req.body.book_num,
        book_info=req.body.book_info,
        book_tag=req.body.book_tag,
        book_keywords=" ";
     bookService.newBook(book_name,book_author,book_tag,book_keywords,book_publisher,book_price,book_info,book_banben,book_img,book_num).then(function(){
      return {
          result:0,
          msg:"success"
      };
    }).catch(function(err){
         console.error(err.stack);
         return {
             result:2,
             msg:"ÃÌº” ß∞‹"
         };
     }).then(function(r){
         res.json(r);
     });
}