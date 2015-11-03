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
    $("#global_search_form").get(0).onsubmit=function(){
        var v=$("#global_search_input").get(0).value;
        if(v!==undefined){
         window.location="/public/html/searchResult.html?search_key="+encodeURIComponent(v);
        }
        return false;
    }

    var slice=function(str){
        return str.slice(0,90)+".....";
    }
    function initBookItem(tar,data) {
        $(tar).attr("href","./bookDetail.html?bookId="+data.id);
        $(tar).find('img').attr("src",data.img_url);
        $(tar).find('.book_name').html(data.book_name);
        $(tar).find('.book_name').attr("title",data.book_name) ;
        $(tar).find(".book_info").html(slice(data.brief_info));
        $(tar).find(".book_price").find('span').html(data.price);
    }
    var render=function(data){
        var i= 0,
            book_items=$(".book_item");
        for(;i<data.length;i++){
            $(book_items[i]).parent().parent().css({display:'block'});
            initBookItem(book_items[i],data[i]);
        }
        for(;i<book_items.length;i++){
            $(book_items[i]).parent().parent().css({display:'none'});
        }
    };
    loading.show();
    $.ajax({
        type:"GET",
        url:"/get_star_book",
        complete:function(res){
            loading.hide();
            if(res.responseJSON.result==0){
                render(res.responseJSON.data);
            }else{
                alert(res.responseJSON.msg||"Failed to get star books!");
            }
        }
    });
});