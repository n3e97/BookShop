/**
 * Created by zj on 2015/10/25.
 */

(function (w) {
	var id = parseInt(window.location.search.split('=')[1]);
	var book_data = {};
	var initPage = function (data) {
		$(function () {
			$("#book_img").attr("src", data.img_url);
			$("#book_name").html("<h2>" + data.book_name + "</h2>");
			$("#book_author").html(data.author);
			$("#book_publisher").html(data.publisher);
			$("#book_banben").html("版本: " + data.banben + '<span class="badge">新</span>');
			$("#book_price").html("价格: " + data.price + "元");
			$("#book_kucun").html("库存: " + data.num_not_sold);
			$("#book_tag").html("标签: " + data.tag);
			$("#detail_info").html(markdown.toHTML(data.brief_info))
		});
	}
	$.ajax({
		type : "POST",
		url : "/getbookinfo",
		dataType : "json",
		data : {
			id : id
		},
		complete : function (res) {
			if (res.responseJSON.result == 0) {
				book_data = res.responseJSON.data;
				initPage(res.responseJSON.data);
			} else {
				alert(res.responseJSON.msg);
			}
		}
	});

	$(function () {
		Cart.show();
		$("#sub").on("click", function () {
			var self = this;
			var r = parseInt($("#buy_num").get(0).value);;
			r > 0 && (r--);
			$("#buy_num").get(0).value = r;
		});
		$("#add").on('click', function () {
			var self = this;
			var r = parseInt($("#buy_num").get(0).value);
			r < book_data.num_not_sold && (r++);
			$("#buy_num").get(0).value = r;
		});
		$("#buy_car").on("click", function () {
			var num = $("#buy_num").get(0).value;
			$.ajax({
				type : "POST",
				url : "buy_book",
				dataType : "json",
				data : {
					book_id : id,
					buy_num : num
				},
				complete : function (res) {
					if(res.responseJSON.result===0){
						var goods={
                            img_url:book_data.img_url,
							name:book_data.book_name,
							href:"./bookDetail.html?bookId="+book_data.id
						};
                       Cart.addGoods(goods)
					}else{
						alert(res.responseJSON.msg);
					}
				}
			});
		});
	})
})(window)
