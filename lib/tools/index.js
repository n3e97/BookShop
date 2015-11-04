/*
* Created by zj on 2015/10/11
* */
var about_auth=require("./about_auth");

exports.sendActivationEmail=require("./sendActivationEmail").sendActivationEmail;
exports.sendNewOrders=require("./sendNewOrders").send;
exports.md5Update=about_auth.md5Update;
exports.jieMa=about_auth.jieMa;
exports.zhuanMa=about_auth.zhuanMa;
exports.isTimeout=about_auth.isTimeout;
exports.getTimeStamp=about_auth.getTimeStamp;
exports.createKey=about_auth.createKey;