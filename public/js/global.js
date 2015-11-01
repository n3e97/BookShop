/**
 * Created by zj on 2015/10/31.
 */
(function(w){
    function getItem(name){
        var r;document.cookie.split(";").forEach(function(i){
            i.split("=")[0]==name&&(r=i);
        });
        return unescape(r);
    }
    !(w.userinfo)&&(w.userinfo={})&&(w.userinfo.key=getItem("key"));
    function getUserInfo(cb){
        if(w.userinfo.key){
            $(function(){
                $.ajax({
                    type:"GET",
                    url:"/getuserinfo",
                    complete:function(res){
                        cb(res.responseJSON);
                    }
                });
            });
        }
    }
    w.getUserInfo=getUserInfo;
    if(!(w.userinfo.key=='undefined')){
        $(function(){
            $("#s_signIn").css({display:'none'});
            $("#s_signUp").css({display:"none"});
            $("#s_userinfo").css({display:"block"});
            $("#s_userinfo>div>a").html(w.userinfo.key.split("&&")[1]+'<i class="caret"></i>');
        });
    }else{
        //alert("no key");
    }
})(window);