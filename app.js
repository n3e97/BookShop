/*
* Created by zj on 2015/10/11
* */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var web_router=require("./web_router.js");
var app = express();

// uncomment after placing your favicon in /public
app.set("env",process.env.NODE_ENV||"dev");
app.set("port",process.env.PORT||9000);
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use("/public",express.static(path.join(__dirname, 'public')));

app.use("/",web_router);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


// error handlers

if (app.get('env') === 'dev') {
    app.use(function(err, req, res, next) {
        res.writeHead(err.status || 500,{"Content-Type":"text/plain"});
        res.end(err.message);
    });
}else{
    app.use(function(err, req, res, next) {
        res.writeHead(err.status || 500,{"Content-Type":"text/plain"});
        res.end(err.message);
    });
}


app.listen(app.get("port"),function(err){
    if(err){
        console.log(err.message);
        process.exit(1);
    }else{
        console.log("Server running at port :"+app.get("port"));
    }
});
