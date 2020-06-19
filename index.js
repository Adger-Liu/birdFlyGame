//对象收编变量 javascript的 var 变量名 是全局变量 当协同开发的时候 两个人变量会声明不同 可能会变成 变量覆盖
// 变量相当于 键值对 
var bird = {
    skyPostion: 0,
    skySetp: 2,
    birdTop: 232,
    birdStepY: 0,
    startColor:"blue",
    startFlg : false,//控制点击游戏的dom
    minTop: 0,//碰撞检测
    maxTop: 570,//小鸟有30的高度
    pipeLength: 7,
    pipeLastIndex:6,
    pipeArr:[
       
    ],
    // 初始化为0
    score: 0,
    // 初始化函数
    init: function(){
        this.initData();
        this.animate();
        this.handle();
        if(sessionStorage.getItem("play")){
            this.start();
        }
    },
    // 初始化所有数据 集中管理 这里有一个调用顺序 如果 先调用 animate 这个函数下面initData就会出现undefined
    initData: function(){
        // 变量挂载 这里写el 是为了直接看出这是个 dom 元素
        this.el = document.getElementById("game-background");
        //拿到小鸟的元素 因为class 属性有多个 有可能别人也叫bird 下面就不知道获取谁了
        // this.oBird = document.getElementsByClassName("bird")[0]; 这里 el 就代表dom了所以不需要 document
        this.oBird = this.el.getElementsByClassName("bird")[0];
        this.oStart = this.el.getElementsByClassName("start")[0];
        this.oScore = this.el.getElementsByClassName("score")[0];
        this.oMask = this.el.getElementsByClassName("mask")[0];
        this.oEnd = this.el.getElementsByClassName("end")[0];
        this.oFinaScroe = this.oEnd.getElementsByClassName("fina-scroe")[0];
        //取出分数div 元素
        this.oRankList = this.oEnd.getElementsByClassName("rank-list")[0];
        this.oReStart = this.oEnd.getElementsByClassName("restart")[0];
        this.scoreArr = this.getScore();
        console.log(this.scoreArr)
    },
    //失败的时候才设置
    setScore: function(){
        //推送数据 对象
        this.scoreArr.push({
            //一个是分数 一个是当前时间
            score: this.score,
            time: this.getDate(),
        });
        this.scoreArr.sort(function(a,b){
            return b.score - a.score;
        })
        setLocal("score",this.scoreArr)
    },
    //获取把本地的数据赋值上去 
    getScore: function(){
        var scoreArr = getLocal("score");
        return scoreArr ? scoreArr : [] ; //键值不存在的情况 值为 null
    },
    getDate: function(){
        var date = new Date();
        var year = formatNumber(date.getFullYear());
        var month = formatNumber(date.getMonth() + 1);
        var day = formatNumber(date.getDate());//当前天
        var hour = formatNumber(date.getHours());//时
        var minute = formatNumber(date.getMinutes());//分
        var second = formatNumber(date.getSeconds());//秒
        return `${year}.${month}.${day}.${hour}.${minute}.${second}`;
    },
    // 管理所有动画
    animate: function(){
        var count = 0;//记录
        var _this = this;
        //管理所有定时器 定时器开太多影响 效率 有个变量 为了下面gameOver结束
        this.timer = setInterval(function(){
            //30毫秒执行一次
            _this.skyMove();
            if(_this.startFlag){
                _this.birdDrop();
                _this.pigeMove();
            }
            // 先 ++ 先+1
            if(++ count % 10 === 0){
                //如果 游戏没开始为false的时候执行 游戏开始为true的时候不执行
                if(!_this.startFlag){
                    _this.birdJump();
                    _this.startBound(); 
                }
                // _this.birdJump();
                // _this.startBound(); 
                // 第几次执行函数
                _this.birdFly(count); 
            }
            // _this.birdJump();
        },30);
        //下一个 10次 执行

        // 为什么不写bird 可能会冲突 别人命名你这个变量名
        // bird.skyMove();
        // bird.birdJump();
        // bird.birdFly();
        // bird.startBound();
        // 使用this 挂载 this指向自己的bird
        // this.skyMove();
        // this.birdJump();
        this.birdFly();
        this.startBound();
    },
    // 天空移动
    skyMove: function(){
        // var _this = this;
        // console.log(this.el);
        // 定时器
        // setInterval(function(){
            //背景图片为什么 不会走完 背景是默认重复的 不会走完
            this.skyPostion -= this.skySetp;
            //这里会出现 this 指向问题 这里面的this 指向了 windows 不知道谁 这里移动速度不是死的
            this.el.style.backgroundPositionX = this.skyPostion + 'px';
        // },30)
    },
    // 小鸟跳转
    birdJump: function(){
        // var _this = this;
        // setInterval(function(){
            //如果起点在 最上面位置就变 相反 === 比的值和类型 一直在这个范围跳 注意赋值完成之后 给birdTop
            this.birdTop =  this.birdTop === 232 ? 260 : 232;
            this.oBird.style.top = this.birdTop + 'px';
            // console.log(_this.birdTop)
        // },300)
    },
    // 小鸟飞
    birdFly: function(count){
        //执行第一次 第一张 依次内推 3张图片 -30 是图片间距
        this.oBird.style.backgroundPositionX = count % 3 * -30 + "px";
    },
    // 小鸟下落
    birdDrop: function(){
       this.birdTop +=  ++ this.birdStepY;
       this.oBird.style.top = this.birdTop + 'px';
       this.checkCollision();
       //加分
       this.addScore();
    },
    // 文字变大变小
    startBound: function(){
        //上一次颜色
        var prevcolor = this.startColor;
        this.startColor = prevcolor === "blue" ? "white" : "blue"
        //操作dom
        // dom.classList.remove("start-" + prevcolor);
        // dom.classList.add("start-" + this.startColor);
        this.oStart.classList.remove("start-" + prevcolor);
        this.oStart.classList.add("start-" + this.startColor);
        //怎么放大 缩小 两个类名切换 
        // if(this.startColor === "blue"){
        //     color = "white";
        // }else{
        //     color = "blue";    
        // }
        //移除原来的类名 增加想要的类名
        // classList.remove("start-" + this.startColor);
        // classList.add("start-" + color)
        // this.startColor = color;
    },
    //碰撞检测方法 临界值 柱子 天上地下检测
    checkCollision: function(){
        this.checkBoundary();
        this.checkPipe();
    },
    // 边界碰撞检测
    checkBoundary: function(){
        //如果小鸟位置小于 大于 最小最大位置
       if(this.birdTop < this.minTop || this.birdTop > this.maxTop){
           //就结束游戏
           this.gameOver();
       }
    },
    addScore: function(){
        var index = this.score % this.pipeLength;
        var pipeX = this.pipeArr[index].up.offsetLeft;
        if(pipeX < 13){
            this.oScore.innerText = ++ this.score;
        }    
    },
    // 柱子碰撞检测
    checkPipe: function(){
        
        var index = this.score % this.pipeLength;
        //拿第几对的数字
        var pipeX = this.pipeArr[index].up.offsetLeft;
        var pipeY = this.pipeArr[index].y;
        var birdY = this.birdTop;
       
        //相遇 pipex = 95
        if((pipeX <= 95 && pipeX >= 13) && (birdY <= pipeY[0] || birdY >= pipeY[1])){
            this.gameOver();
        }
    },
    // 事件
    handle: function(){
        this.handleStart();
        this.hadleClick();
        this.handleRestart();
    },
    // 点击小鸟之后会蹦嘛
    hadleClick: function(){
        var _this = this;
        //点击 top 值 ++ 越往上 top 越小
        this.el.onclick = function(e){
            //判断是否点击的父元素还是子元素
            if(!e.target.classList.contains("start")){
                _this.birdStepY = -10;
            }
            console.log(e.target.classList.contains("start"));
        };
    },
    handleStart: function(){
        var _this = this;
        // this.oStart.onclick = function(){
          
            
        // };
        this.oStart.onclick = this.start.bind(this);
    },
    //抽离
    start: function(){
        var _this = this;
        _this.startFlag = true;
        //点击之后小鸟变到左边
        _this.oBird.style.left = "80px";
        //点击开始游戏消失
        _this.oStart.style.display = "none";
        _this.oScore.style.display = "block";
        _this.oBird.style.transition = "none";
        // 点击之后 skySetp 变大
        _this.skySetp = 5;
        //点击之后 还在变换点击开始游戏的变换分数

        //点击之后才开始创建柱子
        for(var i = 0;i < _this.pipeLength;i++){_this.createPipe(300 * (i + 1));}
    },
    //创建柱子
    createPipe: function(x){
        //高度 随机的高度 0 - 1 柱子有 150高 图片一共 600px 600-150 = 450 /2 = 225 然后 0 - 255 向下取整
        // var upHeight = Math.random() * 225;  50 - 275
        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 600 - 150 - upHeight;
        //上柱子传 参数
        var oUpPige = createEle("div",["pipe","pipe-up"],{
            height: upHeight + "px",
            left: x + "px",
        })
        //下柱子
        var oDownPipe = createEle("div",["pipe","pipe-bottom"],{
            height: downHeight + "px",
            left: x + "px",
        })
        // 设置不同的class
        // var oDiv = document.createElement("div");
        // 设置柱子
        // oDiv.classList.add("pipe");
        // oDiv.classList.add("pipe-up");
        // oDiv.style.height = upHeight + "px";
        // 加到game_background父元素中
        this.el.appendChild(oUpPige);
        this.el.appendChild(oDownPipe);
        this.pipeArr.push({
            up: oUpPige,
            down: oDownPipe,
            y:[upHeight,upHeight + 150],
        })
    },
    //柱子随着天空移动
    pigeMove: function(){
        for(var i = 0;i < this.pipeLength;i++){
            // 上柱子
            var oUpPipe = this.pipeArr[i].up;
            var oDownPipe = this.pipeArr[i].down;
            var x = oUpPipe.offsetLeft - this.skySetp;
            if(x < -52){
                var lastPipeLeft = this.pipeArr[this.pipeLastIndex].up.offsetLeft;
                oUpPipe.style.left = lastPipeLeft + 300 + "px";
                oDownPipe.style.left = lastPipeLeft + 300 + "px";
                this.pipeLastIndex = ++this.pipeLastIndex % this.pipeLength;
                //重新设置一下
                // oUpPipe.style.height = upHeight + "px";
                // oDownPipe.style.height = downHeight + "px";
                continue;
            }
            oUpPipe.style.left = x + "px";
            oDownPipe.style.left = x + "px";
        }   
    },
    //封装成一个函数 每次七根就循环生成
    getPipeHeight: function(){
        // 七根循环 七根一组高度 一样的 
        var upHeight = 50 + Math.floor(Math.random() * 175);
        var downHeight = 600 - 150 - upHeight;
        //别的函数拿到
        return{
            up:upHeight,
            down: downHeight,
        }
    },
    //重新开始
    handleRestart: function(){
        this.oReStart.onclick = function(){
            // alert(1)
            sessionStorage.setItem("play",true);
            //刷新
            window.location.reload(); 
           
        };
    },
    gameOver: function(){
        //怎么清除animate上面的函数
        clearInterval(this.timer)
        //游戏接受后存分数 分数字符串的数
        this.setScore();
        this.oMask.style.display = "block";
        this.oEnd.style.display = "block";
        this.oBird.style.display = "none";
        this.oScore.style.display = "none";
        this.oFinaScroe.innerText = this.score;
        this.renderRankList();
    },
    renderRankList: function(){
        var _this = this;
        innerHTML = "<div></div>"
        var template = "";
        for(var i = 0; i < 8;i++){
            var degree = "";
            switch(i){
                case 0:
                    degreeClass = "first";
                    break;
                case 1:
                    degreeClass = "second";
                    break;
                case 2:
                    degreeClass = "third";
                    break;
            };
            template += `<li class="rank-item">
            <span class="rank-degree ${degreeClass}">${i + 1}</span>
            <span class="rank-scroe">${this.scoreArr[i].score}</span>
            <span class="rank-time">${this.scoreArr[i].time}</span>
        </li>`
        }
        this.oRankList.innerHTML = template
    }
}; 
// 初始函数 有两个 定义了init 初始化所有方法 放在 html中做
// bird.initData();
// bird.animate();