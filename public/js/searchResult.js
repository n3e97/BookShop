/**
 * Created by zj on 2015/10/25.
 */
$(function(){
    Cart.show();
    $(window).bind("load resize",function(){
        var width=(this.window.innerWidth>0)?this.window.innerWidth:this.screen.availWidth;
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
    (function(w){
        var log_data_cache = {
            current_page_id : 0,
            itemPerPage : 8,
            cache_data : []
        };
        var search_key =decodeURIComponent(window.location.search.split('=')[1]);

        function newData(data) {
            log_data_cache.current_page_id=0;
            log_data_cache.cache_data=data;
            nextPage();
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
        var showResult = function (data) {
            var i= 0,
                book_items=$(".book_item");
            for(;i<data.length;i++){
                $(book_items[i]).parent().parent().css({display:'block'});
                initBookItem(book_items[i],data[i]);
            }
            for(;i<book_items.length;i++){
                $(book_items[i]).parent().parent().css({display:'none'});
            }
        }
        var toPage = function (id) {
            id = parseInt(id);
            log_data_cache.current_page_id = id;
            var temp = [];
            for (var i = (id - 1) * 8; i < log_data_cache.cache_data.length && i < id * 8; i++) {
                temp.push(log_data_cache.cache_data[i]);
            }
            showResult(temp);
            $("#pagenation>ul").find("li").each(function () {
                $(this).hasClass("active") && $(this).removeClass("active");
                $(this).text() == id.toString() && ($(this).addClass("active"));
            });
        }
        var nextPage = function () {
            if (log_data_cache.current_page_id * log_data_cache.itemPerPage < log_data_cache.cache_data.length) {
                var f = Math.floor((log_data_cache.current_page_id - 1) / 5),
                    l = Math.floor(log_data_cache.current_page_id / 5);
                log_data_cache.current_page_id++;
                if (f != l) {
                    var start = log_data_cache.current_page_id,
                        to = log_data_cache.current_page_id + 4 < Math.ceil(log_data_cache.cache_data.length / 8) ? log_data_cache.current_page_id + 4 : Math.ceil(log_data_cache.cache_data.length / 8);
                    initPageNav(start, to, start);
                }
                toPage(log_data_cache.current_page_id);
            }
        }
        var prevPage = function () {
            if (log_data_cache.current_page_id > 1) {
                log_data_cache.current_page_id = log_data_cache.current_page_id - 1;
                var f = Math.floor((log_data_cache.current_page_id - 1) / 5),
                    l = Math.floor(log_data_cache.current_page_id / 5);
                if (f != l) {
                    var start = log_data_cache.current_page_id - 4 > 0 ? log_data_cache.current_page_id - 4 : 1,
                        to = log_data_cache.current_page_id;
                    initPageNav(start, to, to);
                }
                toPage(log_data_cache.current_page_id);
            }
        }
        var initPageNav = function (start, to, activeId) {
            var str = ' <li><a href="javascript:my_prevPage()">&laquo;</a></li>';
            for (var i = start; i < to + 1; i++) {
                if (i == activeId) {
                    str += '<li class="active"><a href="javascript:my_toPage(' + i + ')">' + i + '</a></li>';
                } else {
                    str += '<li><a href="javascript:my_toPage(' + i + ')">' + i + '</a></li>';
                }
            }
            str += '<li><a href="javascript:my_nextPage()">&raquo;</a></li>';
            $("#pagenation ul").html(str);
        };

        var search = function (dt, cb) {
            $.ajax({
                type : "POST",
                dataType : 'json',
                url : "/search_book",
                data : dt,
                complete : function (res) {
                    if (!cb) {
                        alert("A callback function needed!")
                    } else {
                        if (res.responseJSON.result != 0) {
                            alert(res.responseJSON.msg);
                        } else {
                            cb(res.responseJSON.data);
                        }
                    }
                }
            });
        }
        var bind_search_event=function(){
            $("#global_search_form").get(0).onsubmit=function(){
                var v=$("#global_search_input").get(0).value;
                if(v){
                    search({search_key:v},newData);
                }
                return false;
            };
            $("#search_form").get(0).onsubmit=function(){
                var v=$("#search_tag").get(0).value;
                if(v){
                    search({search_key:v},newData);
                }
                return false;
            };
        }
        $(function () {
             bind_search_event();
            if(search_key){
               search({search_key:search_key},newData);
            }
        });
        w.my_nextPage = nextPage;
        w.my_prevPage = prevPage;
        w.my_toPage = toPage;
    })(window)
});

