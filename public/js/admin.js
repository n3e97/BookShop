/**
 * Created by zj on 2015/10/31.
 */
$(function(){

});
(function(w){
    var log_data_cache={
        current_page_id:0,
        itemPerPage:10,
        cache_data:[]
    };
    function newData(data){

        nextPage();
    }
    function render(data){
        var str="";
        data.rows.forEach(function(item){
            str+='<div class="panel panel-default"><div class="panel-heading"><h4 class="panel-title">';
            str+='<a data-toggle="collapse"  href="#collapseOne'+item.id+'" data-parent="#accordion" class="log_result_item_header">';
            str+='&nbsp;'+item.title+'</a></h4></div>';
            str+= '<div id="collapseOne'+item.id+'" class="panel-collapse collapse"><div class="panel-body">';
            str+='<pre>'+objectToString(item.ps,0)+"</pre>";
            str+='</div></div></div>';
        });
        return str;
    }
    var showResult=function(data){
        var html=render(data);//Mustache.render(log_result_templates2,data);
        $('#accordion').html(html);
    }

    var toPage=function(id){
        id=parseInt(id);
        log_data_cache.current_page_id=id;
        var temp=[];
        for(var i=(id-1)*10;i<log_data_cache.cache_data.length&&i<id*10;i++)
        {
            temp.push(log_data_cache.cache_data[i]);
        }
        showResult({
            rows:temp
        });
        $("#pagenation ul").find("li").each(function(){
            $(this).hasClass("active")&&$(this).removeClass("active");
            $(this).text()==id.toString()&&($(this).addClass("active"));
        });
    }
    var nextPage=function(){
        if(log_data_cache.current_page_id*log_data_cache.itemPerPage<log_data_cache.cache_data.length){
            var f=Math.floor((log_data_cache.current_page_id-1)/5),
                l=Math.floor(log_data_cache.current_page_id/5);
            log_data_cache.current_page_id++;
            if(f!=l){
                var start=log_data_cache.current_page_id,
                    to=log_data_cache.current_page_id+4<Math.ceil(log_data_cache.cache_data.length/10)?log_data_cache.current_page_id+4:Math.ceil(log_data_cache.cache_data.length/10);
                initPageNav(start,to,start);
            }
            toPage(log_data_cache.current_page_id);
        }
    }
    var prevPage=function(){
        if(log_data_cache.current_page_id>1){
            log_data_cache.current_page_id=log_data_cache.current_page_id-1;
            var f=Math.floor((log_data_cache.current_page_id-1)/5),
                l=Math.floor( log_data_cache.current_page_id/5);
            if(f!=l){
                var start=log_data_cache.current_page_id-4>0?log_data_cache.current_page_id-4: 1,
                    to=log_data_cache.current_page_id;
                initPageNav(start,to,to);
            }
            toPage(log_data_cache.current_page_id);
        }
    }
    var initPageNav=function(start,to,activeId){
        var str=' <li><a href="javascript:my_prevPage()">&laquo;</a></li>';
        for(var i=start;i<to+1;i++){
            if(i==activeId){
                str+= '<li class="active"><a href="javascript:my_toPage('+i+')">'+i+'</a></li>';
            }else{
                str+= '<li><a href="javascript:my_toPage('+i+')">'+i+'</a></li>';
            }
        }
        str+='<li><a href="javascript:my_nextPage()">&raquo;</a></li>';
        $("#pagenation ul").html(str);
    };
    var search=function(dt,cb){
        $.ajax({
            type:"POST",
            dataType:'json',
            url:"/searchlog",
            data:dt,
            complete:function(res){
                if(!cb){
                    alert("A callback function needed!")
                }else{
                    if(res.responseJSON.result!=0){
                        alert(res.responseJSON.msg);
                    }else{
                        cb(res.responseJSON.data);
                    }
                }
            }
        });
    }
    var search_by_key=function(key,cb){
        var dt={search_method:"by_key",data:key};
        search(dt,cb);
    }
    var bind_search_event=function(){
        $("#search_by_key").parent().parent().get(0).onsubmit=function(){
            return false;
        };
        $("#search_by_key").on("click",function(){
            $("#hidden_button").trigger("click");
            var key=$(this).parent().find("input").get(0).value;
            key&&(search_by_key(key,newData));
        });
    }

    $(function(){
     // bind_search_event();
    });
    w.my_nextPage=nextPage;
    w.my_prevPage=prevPage;
    w.my_toPage=toPage;
})(window);

$(function(){
   $(".edit_border").on("mousedown",function(e){
       var edit=$(this).parent(),
           preview=$(this).parent().parent().find(".preview_area");
       var x= e.clientX;
       $(window).on("mouseup",function(){
           $(window).off("mousemove");
           $(window).off("mouseup");
       });
       $(window).on("mousemove",function(ee){
           var offset=ee.clientX-x;
           x=ee.clientX;
           var w_e=parseFloat($(edit).css('width')),
               w_p=parseFloat($(preview).css("width"));
           w_e+=offset;
           w_p-=offset;
           $(edit).css({width:w_e+"px"});
           $(preview).css({width:w_p+"px"});
       });
   });
   $(".edit_area>textarea").on("input propertychange",function(){
          var self=this;
          $(self).parent().parent().find(".preview_area").html(markdown.toHTML($(self).get(0).value));
   });
    //È«ÆÁ
    $(".book_item_full_screen").on("click",function(){
          var self=this;
          var width=window.screen.availWidth,
              height=window.screen.availHeight;
          var dt=$(self).data("isfull");
          dt==undefined&&($(self).data("isfull",false));
          dt=$(self).data("isfull");
          if(!dt){
              var or_width=$(self).parent().parent().parent().css("width");
              $(self).data("or_w",or_width);
              $(self).parent().parent().parent().css({position:"absolute",zIndex:10000,backgroundColor:"white",overflow:"auto"});
              $(self).parent().parent().parent().velocity({width:width+"px",height:height+"px",left:"0px",top:"0px"},100,"ease-in-out",function(){
                  $(self).find("i").removeClass("fa-expand").addClass("fa-compress");
                  $(self).data("isfull",true);
              });
          }else{
              var the_w=$(self).data("or_w");
              $(self).parent().parent().parent().velocity("reverse",function(){
                  $(self).parent().parent().parent().css({position:"inherit",zIndex:0,width:the_w});
                  $(self).data("isfull",false).find("i").removeClass("fa-compress").addClass("fa-expand");
              });
          }
    });
    //ÐÞ¸Ä
    var is_disabled=function(parent,b){
        var obj={
            book_name:$(parent).find(".book_item_name").attr("disabled",b),
            book_author:$(parent).find(".book_item_author").attr("disabled",b),
            book_banben:$(parent).find(".book_item_banben").attr("disabled",b),
            book_publisher:$(parent).find(".book_item_publisher").attr("disabled",b),
            book_price:$(parent).find(".book_item_price").attr("disabled",b),
            book_kucun:$(parent).find(".book_item_kucun").attr("disabled",b),
            book_tag:$(parent).find(".book_item_tag").attr("disabled",b),
            book_info:$(parent).find(".book_info")
        };
        obj.book_info.find("textarea").attr("disabled",b);
        return obj;
    }
    $(".book_item_edit").on("click",function(){
        var parent=$(this).parent().parent().parent();
        is_disabled(parent,false);
    });
    $(".book_item_save").on("click",function(){
        var parent=$(this).parent().parent().parent();
        var obj=is_disabled(parent,true);
        $(this).parent().find(".book_item_refresh").css({visibility:"visible"});
        //to do:....
    });

});