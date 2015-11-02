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

mst_pro.extName(".mst").dir(path.join(__dirname,"../../views")).load("activationEmail");
mst_pro.ok().then(function(){
    mst_pro.parse();
});

var sendActivationEmail=function(email,username,link){
    return new Promise(function(resolve,reject){
        var obj={
            "name":username,
            "link":link
        };
        mst_pro.ok().then(function(){
            transporter.sendMail({
                "from":"3067161234@qq.com",
                "to":email,
                "subject":"SpeedUpBookShop账户激活链接",
                "html":mst_pro.render(obj)
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
exports.sendActivationEmail=sendActivationEmail;
