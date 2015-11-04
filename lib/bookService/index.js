/**
 * Created by zj on 2015/10/31.
 */
var mysql_client=require("../db/mysql_client").mysqlClient;

exports.newBook=function(book_name,author,tag,keywords,publisher,price,brief_info,banben,img_url,num){
   var sql="INSERT INTO book_info(book_name,author,tag,keywords,publisher,price,brief_info,banben,img_url,num_not_sold) values"+
           "(?,?,?,?,?,?,?,?,?,?);";
    var parameters=[book_name,author,tag,keywords,publisher,price,brief_info,banben,img_url,num];
    return Promise.resolve().then(function(){
        return mysql_client.query(sql,parameters);
    });
};
exports.updateBookNum=function(book_id,buy_num){
    var ts=Date.now();
    var sql1="CALL UPDATE_BOOK_INFO(?,?,@rt"+ts+");",sql2="SELECT @rt"+ts+";";
    return Promise.resolve().then(function(){
        return mysql_client.query(sql1,[book_id,buy_num]).then(function(){
           return mysql_client.query(sql2).then(function(r){
              return r[0]["@rt"+ts];
           });
        });
    }).then(function(result){
        if(result===0){
            return undefined;
        }else if(result==1){
            var err=new Error("No Book Matached!");
            err.result=1;
            throw err;
        }else if(result==2){
            var err=new Error("The num of the book whose id is "+book_id+" is not enough!");
            err.result=2;
            throw err;
        }else{
            var err=new Error("Unexpected result!");
            err.result=result;
            throw err;
        }
    });
}
exports.updateBookInfo=function(info){
    var sql="update book_info set ";
    var paramtes=[];
    var fe=false;
    if(info.book_name){
        sql+=(fe?",":" ")+"book_name=?";
        paramtes.push(info.book_name);
        fe=true;
    }
    if(info.author){
        sql+=(fe?",":" ")+"author=?";
        parameters.push(info.author);
        fe=true;
    }
    if(info.tag){
        sql+=(fe?",":" ")+"tag=?";
        parameters.push(info.tag);
        fe=true;
    }
    if(info.price!=undefined&&!info.price<0){
        sql+=(fe?",":" ")+"price=?";
        paramtes.push(info.price);
        fe=true;
    }
    if(info.brief_info){
        sql+=(fe?",":" ")+"brief_info=?";
        parameters.push(info.brief_info);
        fe=true;
    }
    if(info.keywords){
        sql+=(fe?",":" ")+"keywords=?";
        paramtes.push(info.keywords);
        fe=true;
    }
    if(info.banben){
        sql+=(fe?",":" ")+"banben=?";
        paramtes.push(info.banben);
        fe=true;
    }
    if(info.img_url){
        sql+=(fe?",":" ")+"img_url=?";
        paramtes.push(info.img_url);
    }
    sql+="  where id=?;";
    return Promise.resolve().then(function(){
        if(info.book_id==undefined||paramtes.length<2){
            var e=new Error("lack of paramter");
            e.result=2;
            throw e;

        }else{
           paramtes.push(info.book_id);
            return mysql_client.query(sql,paramtes)
        }
    });
};
exports.getBookInfo=function(info){
    var sql="select * from book_info where ",
        paramters=[],
        fe=false;
    if(info.book_name){
        sql+=(fe?" or ":" ")+"book_name=? ";
        paramters.push(info.book_name);
        fe=true;
    }
    if(info.book_id){
        sql+=(fe?" or ":" ")+"id=? ";
        paramters.push(info.book_id);
    }
    sql+=";";
    return Promise.resolve().then(function(){
        if(paramters.length<1){
            var e=new Error("Lack of parameters");
            e.result=2;
            throw e;
        }else{
            return mysql_client.query(sql,paramters);
        }
    })
}
var noSpace=function(str){
    var t="";
    for(var i=0;i<str.length;i++){
        if(str[i]==" "||str[i]=='"'||str[i]=="'"){

        }else{
            t+=str[i];
        }
    }
    return t;
}

exports.searchBook=function(search_key){
    var tk=noSpace(search_key);
    var sql="select * from book_info where book_name like '%"+tk+"%' or author like '%"+tk+"%' or tag like '%"+tk+"%';";
    return mysql_client.query(sql,[]);
}
//vshadj
exports.returnStarBook=function(limit,offset){
    var sql="select * from book_info limit ? offset ?;";
    return mysql_client.query(sql,[limit,offset]);
}

exports.buy_book=function(info){
    var sql="insert into orders_temp(book_id,user_id,num,create_timestamp) values(?,?,?,?);";
    var parameters=[info.book_id,info.user_id,info.num,Date.now().toString()];
    return exports.updateBookNum(info.book_id,info.num).then(function(){
        return mysql_client.query(sql,parameters);
    });
}

exports.getTempOrders=function(user_id){
    var sql="select * from orders_temp where user_is=? and is_submit=0;";
    return mysql_client.query(sql,[user_id]);
}
exports.newOrders=function(user_id,address,books){
    return Promise.resolve().then(function(){
           var book="";
        for(var i=0;i<books;i++){
            book+=books[i].book_id+","+books[i].num+";";
        }
        return book;
    }).then(function(book_list){
        var sql="insert into orders(orders_id,books,user_id,address,create_date,is_completed) values(?,?,?,?,?,?);";
        var o='o'+Date.now()+user_id;
        var parameters=[o,book_list,user_id,address,Date.now(),0];
        return mysql_client.query(sql,parameters).then(function(){
            return o;//返回订单号
        });
    })
}
/*
setTimeout(function(){
    exports.searchBook("无机化学").catch(function(err){
        console.error(err.stack);
        console.log(err);
        return {msg:"error"};
    }).then(function(r){
        var t={
            d:r
        }
        console.log(JSON.stringify(t));
    });
},3000);
*/