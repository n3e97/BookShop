/**
 * Created by zj on 2015/10/31.
 */
var bookService=require("../lib/bookService");
var user_db_service=require("../lib/userService").user_db;
var tools=require("../lib/tools");

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
exports.starBook=function(req,res,next){
   bookService.returnStarBook(8,10).then(function(rt){
        return {
            result:0,
            msg:"success",
            data:rt
        };
   }).catch(function(err){
       console.error(err.stack);
       return {
           result:2,
           msg:"Unknown error!"
       };
   }).then(function(rs){
       res.json(rs);
   })
}
exports.indexBook=function(req,res,next){
    bookService.returnStarBook(36,1).then(function(rt){
        var obj={
            result:0,
            msg:"success",
            data:{
                zhuda:[],
                texiao:[],
                kaoshi:[]
            }
        }
       for(var i=0;i<12;i++){
           obj.data.zhuda.push(rt[i]);
           obj.data.texiao.push(rt[i+12]);
           obj.data.kaoshi.push(rt[i+24]);
       }
        return obj;
    }).catch(function(err){
        console.error(err.stack);
        return {
            result:2,
            msg:"Unknown error!"
        };
    }).then(function(rs){
        console.log(rs);
        res.json(rs);
    })
}

exports.buy_book=function(req,res,next){
  Promsie.resolve().then(function(){
      return user_db_service.getUserInfo(req.userinfo.username).then(function(rt){
            req.userinfo.id=rt[0].id;
            return ;
      });
  }).then(function(){
      var obj={
          book_id:req.body.book_id,
          num:req.body.buy_num,
          user_id:req.userinfo.id
      };
      return bookService.buy_book(obj).then(function(){
          return {
              result:0,
              msg:"success"
          };
      });
  }).catch(function(err){
      console.error(err.satck);
      return {
          result:2,
          msg:err.result!=undefined?err.message:"Failed to buy the book!"
      };
  }).then(function(r){
      res.json(r);
  });
}
exports.submit_orders=function(req,res){
    Promise.resolve().then(function(){
        return user_db_service.getUserInfo(req.userinfo.username).then(function(rt){
            req.userinfo=rt[0];
            return ;
        });
    }).then(function(){
        return bookService.getTempOrders(req.userinfo.id);
    }).then(function(orders){
         return bookService.newOrders(req.userinfo.id,req.userinfo.address,orders).then(function(o){
             return {
                 o:o,
                 books:orders
             };
         });
    }).then(function(order_info){
         tools.sendNewOrders(req.userinfo,order_info);
         return ;
    }).then(function(){
        return {
            result:0,
            msg:"success"
        };
    }).catch(function(err){
        console.error(err.stack);
        return {
            result:err.result!=undefined?err.result:2,
            msg:err.result!=undefined?err.message:"failed to submit the order!"
        }
    }).then(function(rt){
        res.json(rt);
    });
}
exports.returnTempOrder=function(req,res){
    Promise.resolve().then(function(){
        return user_db_service.getUserInfo(req.userinfo.username).then(function(rt){
            req.userinfo=rt[0];
            return ;
        });
    }).then(function(){
        return bookService.getTempOrders(req.userinfo.id);
    }).then(function(orders){
        var task=orders.map(function(item){
             return bookService.getBookInfo({book_id:item.book_id}).then(function(rt){
                 return {
                     name:rt[0].book_name,
                     href:"./bookDetail.html?bookId="+item.book_id,
                     img_url:rt[0].img_url
                 };
             }).catch(function(err){
                 return undefined;
             });
        });
        return Promise.all(task).then(function(results){
            var temp=[];
            results.forEach(function(item){
                item!=undefined&&(temp.push(item));
            });
            return temp;
        })
    }).catch(function(err){
        console.error(err.satck);
        return [];
    }).then(function(rt){
        res.json({
            result:0,
            msg:"success",
            data:rt
        });
    });
}