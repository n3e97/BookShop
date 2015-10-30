/**
 * Created by zj on 2015/10/25.
 */

$(function(){
    $(".book_item").on("mouseover",function(){
        var hot=$(this).find(".hot_info");
        if(hot.data('isMoved')){
        }else{
            hot.data("isMoved",true);
            setTimeout(function(){
                hot.css({marginLeft:'0%'});
            },0);
        }
    });
    $(".book_item").on("mouseout",function(){
        var hot=$(this).find(".hot_info");
        hot.data("isMoved",false);
        setTimeout(function(){
            var obj={marginLeft:"-100%"};
            hot.css(obj);
        },0);
    });
    $(".sidebar>ul>li").on("click",function(){
        var b=$(this).find("a").find("b");
        ($(b).text()=='[+]'&&($(b).text('[-]')))||($(b).text('[+]'));
    })
});