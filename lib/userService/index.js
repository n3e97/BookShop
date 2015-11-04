
/**
 * Created by zj on 2015/10/11.
 */

exports.user_sign=require("./sign");
exports.user_auth=require("./auth");
var db=require("./model");
exports.user_db={
    getUserInfo:db.getUserInfo,
    getAdmin:db.getAdmin
};