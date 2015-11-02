/**
 * Created by zj on 2015/10/11.
 */
var crypto=require("crypto");

var md5Update=function(key){
    var md5 = crypto.createHash("md5");
    var cpass = md5.update(key).digest("hex");
    return cpass;
}

//md5加密后的秘钥长度是32
var getTimeStamp=function(key){
    var timestamp="";
    for(var i=32;i<key.length;i++)
    {
        timestamp+=key[i];
    }
    return timestamp;
}

// 将原始的timestamp转码,隐隐感觉转成字母要好一点。。。
var zhuanMa=function(timestamp){
    var map=['3','5','7','1','9','8','6','4','2','0'];
    var time_stamp=timestamp.toString();
    var result="";
    for(var i=0;i<time_stamp.length;i++)
    {
        result+=map[parseInt(time_stamp[i])];
    }
    return result;
}

//解码得到原始的timestamp
var jieMa=function(timestamp){
    var map=['9','3','8','0','7','1','6','2','5','4'];
    var result="";
    for(var i=0;i<timestamp.length;i++)
    {
        result+=map[parseInt(timestamp[i])];
    }
    return result;
}

var isTimeout=function(timestamp){
    var now=Date.now();
    var time=parseInt(timestamp);
    return (time<now)&&(now-time)<12*60*60*1000?false:true;//2小时后过期
}
var createKey=function(password){
    var time=Date.now();
    var str=password+time;
    return md5Update(str)+zhuanMa(time);
}

exports.md5Update=md5Update;
exports.jieMa=jieMa;
exports.zhuanMa=zhuanMa;
exports.isTimeout=isTimeout;
exports.getTimeStamp=getTimeStamp;
exports.createKey=createKey;
