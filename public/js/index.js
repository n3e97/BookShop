/**
 * Created by Administrator on 2015/10/22.
 */

$(function(){
    $(window).bind("load resize",function(){
        var width= 0;
        width=(this.window.innerWidth>0)?this.window.innerWidth:this.screen.availWidth;
        if(width<768){
            $("#navbar").addClass("collapse");

        }else{
            $("#navbar").removeClass("collapse");
        }
    });
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
});