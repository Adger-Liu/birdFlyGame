// eleName 创建的标签名 要不要设置一个class 设置样式 为什么不是获取 因为这是一个工具js css相当于一个键值对
function createEle(eleName,classArr,styleObj){
    //创建div
    var dom = document.createElement(eleName); 
   
    for(var i = 0; i < classArr.length; i++){
         //添加类名
        dom.classList.add(classArr[i]);
    }

    for(var key in styleObj){
       dom.style[key] = styleObj[key];     
    }
    
    return dom;
}

//存数据
function setLocal(key,value){
    //如果value的值是一个数组或者对象的话 
    if(typeof value === "object" && value !== null){
        //变成字符串
        value = JSON.stringify(value);
    }
    localStorage.setItem(key,value);
};

//取数据
function getLocal(key){
    //取得key判断
    var value = localStorage.getItem(key);
    if(value === null){
        return value;
    }
    //根据数组 对象
    if(value[0] === "[" || value[0] === "{"){
        return JSON.parse(value);
    }
    return value;   
}

function formatNumber(num){
    if(num < 10){
        return "0" + num;
    }
    return num;
}

