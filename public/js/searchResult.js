/**
 * Created by zj on 2015/10/25.
 */
$(function(){
    $(window).bind("load resize",function(){
        var width=(this.window.innerWidth>0)?this.window.innerWidth:this.screen.availWidth;
        if(width<768){
            $("#navbar").addClass("collapse");

        }else{
            $("#navbar").removeClass("collapse");
        }
    });
});