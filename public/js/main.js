/**
 * Created by zj on 2015/10/25.
 */
    var bookitem={
      "title":"欧亨利短篇小说集",
      "briefInfo":"欧·亨利被全世界读者公认为二十世纪初最好的短篇小说家，有�?�美国的莫泊桑�?�之称， ...",
      "imgSrc":"../image/l4.jpg",
      "href":"#",
      "price":55.0
   };
var testData={
    result:0,
    data:{
        zhuda:[],
        texiao:[],
        kaoshi:[]
    }
};
for(var i=0;i<12;i++){
    bookitem.price++;
    testData.data.zhuda.push(bookitem);
    testData.data.texiao.push(bookitem);
    testData.data.kaoshi.push(bookitem);
}

$(function(){
    Cart.show();
    $("#global_search_form").get(0).onsubmit=function(){
        var v=$("#global_search_input").get(0).value;
        if(v!==undefined){
            window.location="/public/html/searchResult.html?search_key="+encodeURIComponent(v);
        }
        return false;
    }
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
    });

    var BookData={
         "zhuda":{index:0,dt:[]},
         "texiao":{index:0,dt:[]},
         "kaoshi":{index:0,dt:[]}
     };
    var index=0;
    var getBookData=function(cb){
       // cb(testData);
        alert("ok");
        $.ajax({
            type:"GET",
            dataType:"json",
            url:"/getindexbookinfo",
            complete:function(res){
                cb(res.responseJSON);
            }
        });

    }
    var pickData=function(tar){
        var temp=[];
        for(var i=tar.index;i<tar.dt.length;i++){
            temp.push(tar.dt[i]);
        }
        tar.index++;
        tar.index=tar.index%(Math.ceil(tar.dt.length/6));
        return temp;
    }
    var slice=function(str){
        return str.slice(0,90)+".....";
    }
    var refreshItemData=function(tar,data){
        $(tar).attr("href","./bookDetail.html?bookId="+data.id);
        $(tar).find('img').attr("src",data.img_url);
        $(tar).find('.book_name').html(data.book_name);
        $(tar).find('.book_name').attr("title",data.book_name) ;
        $(tar).find(".book_info").html(slice(data.brief_info));
        $(tar).find(".book_price").find('span').html(data.price);
        /*
        $(tar).attr("href",""data.href);
        $(tar).find("img").attr("src",data.imgSrc);
        $(tar).find(".book_name").text(data.title);
        $(tar).find(".book_info").text(data.briefInfo);
        $(tar).find(".book_price").find("span").text(" "+data.price);
        */
    }
    var refreshBlock=function(block,datas,t){
        var temp=$(block).find(".book_item");
         temp=temp.sort(function(){
             return Math.random()>0.5?-1:1;
         });
        $(temp).each(function(i,it){
            if(t){
               setTimeout(function(){
                   $(it).parent().animate({opacity:0},1000,"swing",function(){
                       refreshItemData(it,datas[i]);
                      setTimeout(function(){
                          $(it).parent().animate({opacity:1},800,'swing');
                      },0)
                   })
               },1500*i);
            }else{
                refreshItemData(it,datas[i]);
            }
        });
    }
    var setBookItemAnimation=function(){
        index=index%3;
        var block=$(".da-thumbs")[index];
        var dt=(index==0?BookData.zhuda:(index==1?BookData.texiao:BookData.kaoshi));
        refreshBlock(block,pickData(dt),true);
        index++;
    };
    var initBlock=function(){
        $(".area_block").each(function(i,tar){
            var dt=(i==0?BookData.zhuda:(i==1?BookData.texiao:BookData.kaoshi));
            refreshBlock(tar,pickData(dt),false);
        });
    };
    //set up
    getBookData(function(res){
       if(res.result===0){
           var dt=res.data;
           console.log(dt);
           BookData.zhuda.dt=dt.zhuda;
           BookData.texiao.dt=dt.texiao;
           BookData.kaoshi.dt=dt.kaoshi;
           initBlock();
           setTimeout(function(){
               setInterval(setBookItemAnimation,10000);
           },0);
       }else{
           alert(res.msg);
       }
    });
});