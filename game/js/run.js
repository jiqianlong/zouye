window.onload=function(){
    var clientW=document.documentElement.clientWidth;
    var clientH=document.documentElement.clientHeight;
    var canvas=document.querySelector("canvas");
    var cobj=canvas.getContext("2d");
    canvas.width=clientW;
    canvas.height=clientH;
    var runs=document.querySelectorAll(".run");
    var jumps=document.querySelectorAll(".jump");
    var hinderImg=document.querySelectorAll(".hinder");
    var zidanImg=document.querySelectorAll(".zidan");
    var life1=document.querySelector(".life1");
    var jifen1=document.querySelector(".jifen1");
    var game1=new game(canvas,cobj,runs,jumps,hinderImg,zidanImg,life1,jifen1);

    var input=$("#star");
    var mask=$(".mask");
    var start=$(".start");
    input.one("click",function () {
        game1.play(start,mask);
    })

}