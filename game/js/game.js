function person(canvas,cobj,runs,jumps) {
    this.x=100;
    this.y=320;
    this.canvas=canvas;
    this.cobj=cobj;
    this.width=200;
    this.height=145;
    this.status="runs";
    this.state=0;
    this.speedx=5;
    this.speedy=10;
    this.zl=10;
    this.runs=runs;
    this.jumps=jumps;
    this.life=2;
}
person.prototype={
    draw:function () {
       this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this[this.status][this.state], 0, 0, this.width, this.height);
        this.cobj.restore();
    }
};
//障碍物
function hinder(canvas,cobj,hinderImg) {
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.x=canvas.width-100;
    this.y=390;
    this.width=90;
    this.height=90;
    this.state=0;
}
hinder.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.hinderImg[this.state],0,0,300,300,0,0,this.width+50,this.height+50);
        this.cobj.restore();
    }
}
//血花
function liuxue(canvas,cobj,x,y){
    this.canvas=canvas;
    this.cobj=cobj;
    this.x=x;
    this.y=y;
    this.canvasw=canvas.width;
    this.canvash=canvas.height;
    this.speedy=2*Math.random()-1;
    this.speedx=4*Math.random()-2;
    this.color="red";
    this.zl=0.05;
    this.r=3+Math.random();
    this.speedr=0.1;
}
liuxue.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.beginPath();
        this.cobj.arc(0,0,this.r,0,2*Math.PI);
        this.cobj.fillStyle=this.color;
        this.cobj.fill();
        this.cobj.restore();
    },
    updata:function () {
        this.x+=this.speedx;
        this.speedy+=this.zl;
        this.y+=this.speedy;
        this.r-=this.speedr;
    }
}
function xue(canvas,cobj,x,y){
    var arr=[];
    for (i=0;i<30;i++){
        var obj=new liuxue(canvas,cobj,x,y);
        arr.push(obj);
    };
    var t=setInterval(function () {
        cobj.clearRect(0,0,this.canvasw,this.canvash);
        for(i=0;i<arr.length;i++){
            arr[i].draw();
            arr[i].updata();
            if (arr[i].r<0){
                arr.splice(i,1);
            }
        }
        if(arr.length==0){
            clearInterval(t);
        }
    },50)
}
//子弹
function zidan(canvas,cobj,zidanImg){
    this.canvas=canvas;
    this.cobj=cobj;
    this.speedx=10;
    this.jiasudu=1;
    this.x=0;
    this.y=380;
    this.width=80;
    this.height=80;
    this.zidanImg=zidanImg;
    this.state=0;
}
zidan.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.drawImage(this.zidanImg[this.state],0,0,200,200,0,0,this.width,this.height);
        this.cobj.restore();
    },
    updata:function () {
        this.speedx+=this.jiasudu;
        this.x+=this.speedx;
    }
}
//障碍物爆炸
function baozha(canvas,cobj,x,y){
    this.canvas=canvas;
    this.cobj=cobj;
    this.x=x;
    this.y=y;
    this.w=canvas.width;
    this.h=canvas.height;
    this.speedx=2*Math.random()-1;
    this.speedy=4*Math.random()-2;
    this.r=5+Math.random();
    this.speedr=0.1;
    this.color="rgb("+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+","+parseInt(Math.random()*255)+")";
}
baozha.prototype={
    draw:function () {
        this.cobj.save();
        this.cobj.translate(this.x,this.y);
        this.cobj.beginPath();
        this.cobj.arc(0,0,this.r,0,2*Math.PI);
        this.cobj.fillStyle=this.color;
        this.cobj.fill();
        this.cobj.restore();
    },
    updata:function () {
        this.x-=this.speedx;
        this.y-=this.speedy;
        this.r-=this.speedr;
    }
}
function bao(canvas,cobj,x,y) {
    var arr=[];
    for (i=0;i<20;i++){
        var obj=new baozha(canvas,cobj,x,y);
        arr.push(obj)
    }
    var t1=setInterval(function () {
        cobj.clearRect(0,0,this.w,this.h);
        for (i=0;i<arr.length;i++){
            arr[i].draw();
            arr[i].updata();
            if (arr[i].r<0){
                arr.splice(i,1);
            }
            if (arr.length<0){
                clearInterval(t1);
            }
        }
    },50)
}
//游戏主类
function game(canvas,cobj,runs,jumps,hinderImg,zidanImg,life1,jifen1){
    this.canvas=canvas;
    this.cobj=cobj;
    this.hinderImg=hinderImg;
    this.width=canvas.width;
    this.height=canvas.height;
    this.spe=7;
    this.store=0;
    this.ifire=false;
    this.name="";
    this.zidanImg=zidanImg;
    this.life1=life1;
    this.jifen1=jifen1;
    this.zidanobj=new zidan(canvas,cobj,zidanImg);
    this.hinderArr=[];
    this.person=new person(canvas,cobj,runs,jumps);
    this.isrun=false;
    //move
    this.ts={};
    this.num=0;
    this.num1=0;
    this.top=0;
    this.num2=0;
    this.rand=(Math.ceil((2+Math.random()*3)))*1000;
    //move2
    this.flag=true;
    this.inita=0;
    this.speeda=5;
    this.r=80;
    this.y1=this.person.y;
}
game.prototype={
    play:function (start,mask) {
        this.name=prompt("请输入用户名","jql");
        start.css("animation","start1 2s ease forwards");
        mask.css("animation","mask1 2s ease forwards");
        this.run();
        this.key();
        this.startfire();
    },
    run:function(){
        var that=this;
        // that.runA.play();
        that.ts.t1=setInterval(function(){
            that.move();

        },50);
    },
    move:function () {
        var that=this;
        that.num++;
        that.num1+=7;
        that.cobj.clearRect(0,0,that.width,that.height);
            if(that.person.status=="jumps"){
                that.person.state=0;
            }else{
                that.person.state=that.num%12;
            }
            // if(top>=320){
            //     top=320;
            // }else{
            //     that.person.y+=that.person.zl;
            //     top+=that.person.speedy;
            // }
            // that.person.y=top;
            that.person.draw();

            //障碍物
            that.num2+=50;
            if(that.num2%that.rand==0){
                that.num2=0;
                var obj=new hinder(that.canvas,that.cobj,that.hinderImg);
                obj.state=Math.floor(Math.random()*that.hinderImg.length);
                that.hinderArr.push(obj);
            }
            if (that.hinderArr.length>that.hinderImg.length){
                that.hinderArr.shift();
            }
            for(var i=0;i<that.hinderArr.length;i++){
                that.hinderArr[i].x-=that.spe;
                that.hinderArr[i].draw();
                if(hitPix(that.canvas,that.cobj,that.person,that.hinderArr[i])){
                    if(!that.hinderArr[i].falg1){
                        that.person.life--;
                        var life2=document.getElementsByClassName("life2")[0];
                        life2.style.width=100*that.person.life/4+"px";
                        life2.style.background="red";
                        that.life1.style.background="none";
                        //操作流血
                        xue(that.canvas,that.cobj,that.person.x+that.person.width/2+10,that.person.y+that.person.width/2)
                    }
                    if(that.person.life<0){
                        // alert("Game Over!");
                        // location.reload();
                        //存储
                        var messages=localStorage.messages?JSON.parse(localStorage.messages):[];

                        var temp={name:that.name,store:that.store};
                        // 排序
                        if(messages.length>0){
                            messages.sort(function(a,b){
                                return a.store<b.store;
                            });
                            if(messages.length==3){
                                if(temp.store>messages[messages.length-1].store){
                                    messages[messages.length-1]=temp;
                                }
                            }else if(messages.length<3){
                                messages.push(temp);
                            }
                        }else{
                            messages.push(temp);
                        }

                        localStorage.messages=JSON.stringify(messages);
                        messages.push(temp);
                        // location.reload();
                        that.over();
                    }
                    that.hinderArr[i].falg1=true;
                }else if(that.hinderArr[i].width+that.hinderArr[i].x<that.person.x){
                    if(!that.hinderArr[i].falg1&&!that.hinderArr[i].falg){
                        var jifen1=document.getElementsByClassName("jifen1")[0];
                        jifen1.innerHTML=++that.store;
                    }
                    that.hinderArr[i].falg=true;
                }
                //子弹和障碍物碰撞
                if (that.ifire){
                    if(hitPix(that.canvas,that.cobj,that.zidanobj,that.hinderArr[i])){
                        bao(that.canvas,that.cobj,that.hinderArr[i].x,that.hinderArr[i].y);
                        that.hinderArr.splice(i,1);
                    }
                }
            }
            if(that.ifire){
                if(that.zidanobj.x+that.zidanobj.width>500){
                    that.ifire=false;
                    that.zidanobj.speedx=5;
                }
                that.zidanobj.draw();
                that.zidanobj.updata();
            }
            //操作背景图移动
            that.canvas.style.backgroundPositionX=-that.num1+"px";
    },

    key:function () {
        var that=this;
        document.onkeydown=function (e) {
            if(e.keyCode==38){
                if(!that.isrun){
                    for(var i in that.ts){
                        clearInterval(that.ts[i]);
                    }
                    // that.runA.pause();
                    that.isrun=true;
                }else if(that.isrun){
                    that.ts.t1=setInterval(function(){
                        that.move();
                    },50);
                    if(!that.flag){
                        clearInterval(that.ts.t2);
                        that.ts.t2=setInterval(function(){
                            that.move2();
                        },50);
                    }
                    // that.runA.play();
                    that.isrun=false;
                }
            }else if(e.keyCode==32){
                if(!that.flag){
                    return;
                }
                that.flag=false;
                // that.jumpA.play();
                // that.runA.pause();
                that.person.status="jumps";
                that.ts.t2=setInterval(function(){
                    that.move2();
                },50)
            }
        }
    },
    move2:function () {
        var that=this;
        that.inita+=that.speeda;
        var top1=Math.sin(that.inita*Math.PI/180)*that.r;
        if(that.inita>=180){
            clearInterval(that.ts.t2);
            // that.runA.play();
            that.person.y=that.y1;
            that.person.status="runs";
            that.flag=true;
            that.inita=0;
        }else{
            that.person.y=that.y1-top1;
        }
    },
    over:function () {
        for(var i in this.ts){
            clearInterval(this.ts[i]);  //关闭所有的计时器
        }
        var over=document.querySelector(".over");
        over.style.animation="start 2s ease forwards";
        // this.runA.pause();
        //记录分数
        var scoreEle=document.querySelector(".scoreEle");
        scoreEle.innerHTML=this.store;
        var lis=document.querySelector(".over ul");
        var messages=localStorage.messages?JSON.parse(localStorage.messages):[];
        var str="";
        for (var i = 0; i < messages.length; i++) {
            str+="<li>"+messages[i].name+"："+messages[i].store;
        }
        lis.innerHTML=str;
        this.again();
    },
    again:function () {
        var that=this;
        var btn1=document.querySelector(".again");
        btn1.onclick=function(){
            var over=document.querySelector(".over");
            over.style.animation="start1 2s ease forwards";
            that.person.x=0;
            that.person.y=300;
            that.person.life=3;
            that.hinderArr=[];
            that.inita=0;
            that.y1=that.person.y;
            that.jifen1.innerHTML=0;
            that.life1.style.background="green";
            that.life1.style.width=100+"px";
            that.run();
            btn1.onclick=null;
        }
    },
    startfire:function () {
        var that=this;
        $(".mask").click(function () {
            if (that.ifire){
                return false;
            }
            that.ifire=true;
            that.zidanobj.x=that.person.x+that.zidanobj.width;
            that.zidanobj.y=that.person.y+50;
        })
    }
}
