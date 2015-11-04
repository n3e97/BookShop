/**
 * Created by zj on 2015/11/4.
 */
var bookService=require("../bookServiec");
var user_db_service=require("../userService").user_db;
var Mustache=require("mustache-promise");
var nodemailer=require("nodemailer");
var smtpPool=require("nodemailer-smtp-pool");
var path=require("path");

var options={
    "service":"QQ",
    "auth":{
        "user":"3067161234@qq.com",
        "pass":"zxc159357"
    },
    "maxConnections":5,
    "secure":true
};

var transporter = nodemailer.createTransport(smtpPool(options));
var mst_pro=new Mustache();

mst_pro.extName(".mst").dir(path.join(__dirname,"../../views")).load("ordersnotify");
mst_pro.ok().then(function(){
    mst_pro.parse();
});

var sendEmail=function(email,info){
    return new Promise(function(resolve,reject){

        mst_pro.ok().then(function(){
            transporter.sendMail({
                "from":"3067161234@qq.com",
                "to":email,
                "subject":"ÐÂ¶©µ¥",
                "html":mst_pro.render(info)
            },function(err,res){
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            });
        });
    });
}

var getInfo=function(userinfo,orderinfo){
   Promise.resolve().then(function(){
       var task=orderinfo.books.map(function(item){
           return bookService.getBookInfo({book_id:item.book_id}).then(function(rt){
               return {
                   book_id:item.book_id,
                   book_name:rt[0].book_name,
                   book_price:rt[0].price,
                   num:item.num
               }
           }).catch(function(){
               return undefined;
           })
       });
       return Promise.all(task).then(function(results){
           var temp=[];
           results.forEach(function(item){
               item!=undefined&&(temp.push(item));
           });
           return temp;
       });
   }).then(function(book_info){
       var obj={
           orders_id:orderinfo.o,
           username:userinfo.username,
           address:userinfo.address,
           phone:userinfo.phone,
           books:book_info
       };
       obj.total_price=0;
       book_info.forEach(function(it){
           obj.total_price+=it.book_price;
       });
       return obj;
   });
};
var getEmails=function(){
   return  user_db_service.getAdmin().then(function(rt){
       var emails="";
       var fe=false;
       rt.forEach(function(item){
           if(item.email){
               emails+=(fe?",":" ")+item.email;
               fe=true;
           }
       });
       return emails;
   })
}
var send=function(userinfo,orders){
    var email="";
    getEmails().then(function(e){
        email=e;
        return getInfo(userinfo,orders);
    }).then(function(info){
       sendEmail(email,info);
    })
}
exports.send=send;