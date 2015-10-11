/**
 * Created by zj on 2015/10/11.
 */

var mysql_client=require('../../db/mysql_client').mysqlClient;

exports.newUser=function(username,email,password,phone,address){
    var sql="insert into userinfo(username,email,password,phone,address) values(?,?,?,?,?);";
    var parameters=[username,email,password,phone,address];
    return mysql_client.query(sql,parameters);
};
exports.getUserInfo=function(username){
    var sql="select * from userinfo where username=?;";
    var parameter=[username];
    return mysql_client.query(sql,parameter);
}
exports.checkExist=functon(username,email,phone){
    var sql="select * from userinfo where username=? or email=? or phone=?;";
    var parameters=[username,email,phone];
    return mysql_client.query(sql,parameters).then(function(res){
       //to do :检查存在什么

    }).catch(function(){
        return {
            "exist":false
        };
    })
}

exports.activateAccount=function(username){
    var sql="update userinfo set is_activated=true where username=?;";
    var parameters=[username];
    mysql_client.query(sql,parameters);
}