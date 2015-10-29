/**
 * Created by zj on 2015/10/25.
 */
'use strict'
function alertMsg(num,res){
    var color=res.result<2?"lightgreen":"red";
    var msg=res.msg;
    $("#messageBox"+num).html(msg).css({color:color});
    $("#messageButton"+num).trigger("click");
    setTimeout(function(){
        $("#messageButton"+num).trigger("click");
    },2000);
}
function login_event_bind(){
    $("#login_form").get(0).onsubmit=function(){
        return false;
    }
   $("#login_submit").on("click",function(e){
       var email=$("#login_email").get(0).value;
       var password=$("#login_password").get(0).value;
       if(email!==undefined&&password!==undefined){
           $.ajax({
               type:"POST",
               url:"/login",
               dataType:"json",
               data:{email:email,password:password},
               complete:function(res){
                   alertMsg(1,res.responseJSON);
               }
           });
       }
  });
}
function regist_event_bind(){
    $("#register_form").get(0).onsubmit=function(){
        return false;
    }
    $("#register_submit").on("click",function(e){
        var email=$("#register_email").get(0).value,
            phone=$("#register_phone").get(0).value,
            address=$("#register_address").get(0).value,
            password=$("#register_password").get(0).value,
            re_password=$("#password_confirmation").get(0).value,
            username=$("#register_username").get(0).value;
        if(email!==undefined&&password!==undefined&&phone!=undefined&&address!=undefined&&username!=undefined&&re_password!=undefined){
            if(password===re_password&&phone.toString().length===11){
                $.ajax({
                    type:"POST",
                    url:"/register",
                    dataType:"json",
                    data:{email:email,password:password,address:address,phone:phone,username:username},
                    complete:function(res){
                        alertMsg(2,res.responseJSON);
                    }
                });
            }else{
                var obj={
                    result:2,
                    msg:"Confirm password failed!"
                };
                if(phone.toString().length!=11)
                obj.msg='Invalid phone number!';
                alertMsg(2,obj);
            }
        }
    });
}
function reset_event_bind() {
  $("#reset_form").get(0).onsubmit=function(){
      return false;
  };
    $("#reset_submit").on("click",function(){
       var email=$("#reset_email").get(0).value;
       if(email!==undefined){
           $.ajax({
               type:"POST",
               url:"/reset_password",
               dataType:"json",
               data:{email:email},
               complete:function(res){
                   alertMsg(3,res.responseJSON);
               }
           });
       }
    });
}
function show(id){
     $(id).css({display:'block'});
}
function showWigets(){
    var id=parseInt(window.location.search.split('=')[1]);
    if(id==1){
         show("#login_text");
         show("#login_form");
         login_event_bind();
    }else if(id==2){
        show("#register_text");
        show("#register_form");
        regist_event_bind();
    }else if(id==3){
        show("#reset_text");
        show("#reset_form");
        reset_event_bind();
    }else{}
}
$(function(){
    showWigets();
    $(window).bind("load resize",function(){
        var width=(this.window.innerWidth>0)?this.window.innerWidth:this.screen.availWidth;
        if(width<768){
            $("#navbar").addClass("collapse");

        }else{
            $("#navbar").removeClass("collapse");
        }
    });
})