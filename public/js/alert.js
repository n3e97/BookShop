/**
 * Created by zj on 2015/11/3.
 */
/*
  覆盖了原生的alert
  alert(msg,function(r){
    r 的值是true or false
  });
  依赖： jquery.js ,font-awesome.css
 */
(function(w){
    var log={},
        is_in_body=false,
        tasks_stack=[],
        is_show=false,
        appendToBody=function(){
            var div1=document.createElement("div");
            var div2=document.createElement("div");
            div1.setAttribute("id",'alert_widget_mubu');
            div1.style.cssText='width:100%;min-height:100%;background-color:black;z-index:1000;opacity:0.4;-moz-opacity: 0.4;filter:alpha(opacity=40);position:fixed;left:0px;top:0px;';
            div2.setAttribute("id","alert_widget_c");
            div2.style.cssText='width:100%;height:120px;background-color:black;z-index:1000;opacity:0.9;-moz-opacity: 0.9;filter:alpha(opacity=90);position:fixed;left:0%;top:33%;z-index:1001;';
            var html='<div id="alert_widget_wi" style="color:white; margin-left:25%;margin-top:20px;">'+
                '<i class="fa fa-times" style="color:red;font-size: x-large;"></i><span style="color:white;font-size: x-large;">  Warning</span><p></p></div>'+
                '<div id="alert_widget_buttons" style="margin-left:70%;">'+
                '<button id="alert_widget_yes" style="width:70px;height:30px;color:black;border-radius:5px;background-color: white;">YES</button>'+
                '<button id="alert_widget_no" style="width:70px;height:30px;color:black;border-radius:5px;background-color: white;margin-left:15px;">NO</button></div>';
            div2.innerHTML=html;
            $("body").get(0).appendChild(div1);
            $("body").get(0).appendChild(div2);
        },
        show=function(){
            var msg=tasks_stack[0].msg;
            if(msg){
                $("#alert_widget_wi").find('p').html(msg);
            }
            $("#alert_widget_mubu").show();
            $("#alert_widget_c").show();
        },hide=function(cb){
            $("#alert_widget_mubu").hide(0);
            $("#alert_widget_c").hide(0,function(){
                is_show=false;
                ((typeof cb)=='function')&&cb();
            });
        };

    log.alert=function(msg,cb){
        tasks_stack.push({
            msg:msg,
            cb:cb
        });//任务队列 push 对 shift
        if(!is_show){
            is_show=true;
            if(is_in_body){
                show();
            }else{
                appendToBody();
                is_in_body=true;
                setTimeout(function(){
                    bind_event();
                    show();
                },400);
            }
        }
    };
    var bind_event=function(){
        $("#alert_widget_yes").on("click",function(){
            var obj=tasks_stack.shift();
            (obj.cb&&(typeof obj.cb)=='function')&&(obj.cb(true));
            hide(function(){
                setTimeout(function(){
                    tasks_stack.length!==0&&(show());
                },800);
            });
        });
        $("#alert_widget_no").on("click",function(){
            var obj=tasks_stack.shift();
            (obj.cb&&(typeof obj.cb)=='function')&&(obj.cb(false));
            hide(function(){
                setTimeout(function(){
                    tasks_stack.length!==0&&(show());
                },800);
            });
        });
    };
    w.original_alert=alert;
    w.alert=log.alert;

})(window);

/* test
setTimeout(function(){
    alert("Are you sure to logout?",function(t){
        original_alert(t);
    });
    setTimeout(function(){
        alert("Warning!",function(t){
            original_alert(t);
        })
    },2000)
},3000);
*/