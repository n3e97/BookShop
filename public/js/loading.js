/**
 * Created by zj on 2015/11/3.
 */
/*
 * Loading widget
 * 对外暴露全局 loading对象; loading.show(msg)msg可选，默认‘We are loading。。。’;loading.hide()
 * 无依赖的css 和html文件(除依赖的库文件)
 * dependencies: jquery ,velocity,font-awesome
 * */
(function(w){
    var loading={};
    var is_in_body=false;
    var appendToBody=function(){
        var div=document.createElement("div");
        //还是操作原生DOM接口有感觉啊 :)
        div.setAttribute("id",'loading_widget');
        div.style.cssText='width:100%;height:100%;position:fixed;top:0%;left:0%;background-color: whitesmoke;opacity:0.7;-moz-opacity: 0.7;filter:alpha(opacity=70);z-index:1000;display: none;';
        var html='<div id="loading_icon" style="text-align: center;font-size: 60px;color:black;position:fixed;left:40%;top:0%;"><i class="fa fa-spinner fa-spin"></i></div>'+
            '<div id="loading_msg" style="word-spacing: 15px;font-size: xx-large;position:fixed;left:47%;top:45%;">We are loading....</div>';
        div.innerHTML=html;
        $("body").get(0).appendChild(div);
    }
    var show=function(msg){
        if(msg){
            $("#loading_msg").html(msg);
        }
        $("#loading_widget").show(0,function(){
            $("#loading_icon").velocity({top:"40%"},2000,'spring');
        });
    }
    loading.show=function(msg){
        if(is_in_body){
            show(msg);
        }else{
            appendToBody();
            is_in_body=true;
            setTimeout(function(){
                show(msg);
            },400);
        }
    }
    loading.hide=function(){
        $("#loading_icon").velocity({top:"-10%"},200,function(){
            $("#loading_widget").velocity({opacity:0},800,function(){
                $("#loading_widget").css({display:'none'});
            });
        });
    }
    w.loading=loading;

})(window)

/* test
setTimeout(function(){
    loading.show("just a minute :)");
    setTimeout(function(){
        loading.hide();
    },3000);
},1000);
    */