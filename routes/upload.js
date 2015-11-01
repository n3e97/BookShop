/**
 * Created by zj on 2015/11/1.
 */

var formidable=require("formidable");
var path=require("path");
var fs=require("fs");
exports.recieve_img=function(req,res,next){
    new Promise(function(resolve,reject){
        var form = new formidable.IncomingForm();
        form.uploadDir=path.join(__dirname,"../public/image");
        form.keepExtensions = true;
        form.parse(req, function(err, fields, files) {
           if(err){
             reject(err);
           }else{
               var temp=files.upload.path.split("\\");
               var img_url="../image/"+temp[temp.length-1];
               var cb="<script>top.upload_img_cb('"+img_url+"');</script>";
               resolve(cb);
           }
        });
    }).catch(function(err){
            console.log("upload img error!");
            console.error(err.stack);
            return "<script>top.handle_upload_err('"+err.message+"');</script>";
        }).then(function(cb){
           res.end(cb);
        });
}

exports.remove_img=function(req,res,next){
    new Promise(function(resolve,reject){
        var src=req.body.src;
        var p1=path.join(__dirname,"../public/html");
        var p2=path.join(p1,src);
        fs.unlink(p2,function(err){
            if(err){
                reject(err);
            }else{
                resolve();
            }
        });
    }).catch(function(err){
            console.error(err.stack);
            return '';
        }).then(function(){
            res.end();
        });
}
