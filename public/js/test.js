
$(function(){
    $(".book_item").on("mouseover",function(){
        var hot=$(this).find(".hot_info");
        if(hot.data('isMoved')){

        }else{

            hot.data("isMoved",true);
            setTimeout(function(){
                hot.css({marginTop:'-102%'});
            },0);
        }
    });
    $(".book_item").on("mouseout",function(){
        var hot=$(this).find(".hot_info");
        hot.data("isMoved",false);
        setTimeout(function(){
            hot.css({marginTop:'0%'});
        },0);
    });
});