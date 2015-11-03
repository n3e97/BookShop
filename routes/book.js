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
             msg:"添加书目失败"
         };
     }).then(function(r){
         res.json(r);
     });
}
exports.searchBook=function(req,res,next){
  var search_key=req.body.search_key;
    bookService.searchBook(search_key).then(function(rt){
        return {
            result:0,
            data:rt,
            msg:"success"
        }
    }).catch(function(err){
        console.error(err.stack);
        return {
            result:2,
            msg:"failed to searck book"
        };
    }).then(function(r){
        res.json(r);
    });
}
exports.returnBookInfo=function(req,res,next){
    var info={
        book_id:req.body.id
    };
     bookService.getBookInfo(info).catch(function(err){
         console.error(err.satck);
         return [];
     }).then(function(rt){
         res.json({
             result:rt[0]!=undefined?0:2,
             data:rt[0],
             msg:rt[0]!=undefined?"success":"该书不存在"
         });
     });
}
