/**
 * Created by zj on 2015/11/4.
 */

/*
  购物车
*/
(function(w){
    var cart={},
        cd=function(){
        return document.createElement("div");
        },
        appendToBody=function(){
          var d1=cd();
          d1.setAttribute("id","my_car_widget");
          d1.innerHTML='<div id="my_car_widget_toggle"></div><div id="my_car_widget_box"><div id="my_car_widget_submit"><div>提交订单</div></div></div>';
          $('body').get(0).appendChild(d1);
        },
        bind_delete_event=function(){
            $(".my_car_widget_goods_delete").off("click");
            $(".my_car_widget_goods_delete").on("click",function(){
                var self=this;
                alert("Are you sure to delete this good?",function(flag){
                    if(flag){
                        $(self).parent().remove();
                    }
                });
            });
        },
        add_goods=function(goods){

            /*
            goods={
                name:"",
                img_url:"",
                href:""
            }*/

            var d2=cd();
            d2.className='my_car_widget_goods';
            var html='<div class="my_car_widget_goods_img"><img style="width:100%;height:auto;" src="'+goods.img_url+'"></div>'+
                '<div class="my_car_widget_goods_name"><a href="'+goods.href+'">'+goods.name+'</a></div>'+
                '<div class="my_car_widget_goods_delete pull-right"><i class="fa fa-times"></i></div>';
            d2.innerHTML=html;
            $(d2).insertBefore($("#my_car_widget_submit"));
            setTimeout(function(){
                bind_delete_event();
            },200);
        },
        initCart=function(){
            $.ajax({
                type:"GET",
                url:"/get_order_temp",
                complete:function(res){
                  if(res.responseJSON.result!==0){
                      alert(res.responseJSON.msg);
                  }else{
                      var dt=res.responseJSON.data;
                      for(var i=0;i<dt.length;i++){
                        add_goods(dt[i]);
                      }
                  }
                }
            })
        },
        show=function(){
            $(function(){
                appendToBody();
                setTimeout(function(){
                    $("#my_car_widget_toggle").data("is_in",false);
                    bind_delete_event();
                    $("#my_car_widget_toggle").on("click",function(){
                        ($(this).data("is_in")&&($("#my_car_widget_box").slideUp(400),$(this).data("is_in",false)))||($("#my_car_widget_box").slideDown(400),$(this).data("is_in",true));
                    });
                    $("#my_car_widget_submit").on("click",function(){
                        $.ajax({
                            type:"GET",
                            url:"/submit_orders",
                            complete:function(res){
                              if(res.responseJSON.result!==0){
                                  alert(res.responseJSON.msg);
                              }
                            }
                        });
                    });
                    initCart();
                },300);
            });
        },
        hide=function(){
            $("#my_car_widget").hide();
        };
    cart.addGoods=add_goods;
    cart.show=show;
    cart.hide=hide;
    w.Cart=cart;
})(window);