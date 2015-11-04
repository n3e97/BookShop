/**
 * Created by zj on 2015/10/11.
 */

var mysql_client=require('../../db/mysql_client').mysqlClient;

exports.newUser=function(username,email,password,phone,address){
    var sql="insert into user_table(username,email,password,phone,address) values(?,?,?,?,?);";
    var parameters=[username,email,password,phone,address];
    return mysql_client.query(sql,parameters);
};
exports.getUserInfo=function(username){
    var sql="select * from user_table where username=?;";
    var parameter=[username];
    return mysql_client.query(sql,parameter);
}
exports.checkExist=function(username,email,phone){
    var sql="select * from user_table where username=? or email=? or phone=?;";
    var parameters=[username,email,phone];
    return mysql_client.query(sql,parameters).then(function(res){
        var obj={
            exist:false,
            message:""
        };
        if(res[0].username){
             obj.exist=true;
            obj.message="the username :"+username+" has already been used by others!";
        }
        if(res[0].email){
            obj.exist=true;
            obj.message="the email :"+email+" has already been used by others!";
        }
        if(res[0].phone){
            obj.exist=true;
            obj.message="the phone :"+phone+" has already been used by others!";
        }
        return obj;
    }).catch(function(){
        return {
            "exist":false
        };
    });
}
exports.activateAccount=function(username){
    var sql="update user_table set is_activated=1 where username=?;";
    var parameters=[username];
    mysql_client.query(sql,parameters);
}

exports.getAdmin=function(){
    var sql="select * from user_table where is_admin=1;";
    return mysql_client.query(sql,[]);
}