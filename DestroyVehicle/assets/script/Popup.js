window.Popup={};
Popup = {
    _type:          null,   // 弹窗的类型
    _popup:         null,   // prefab
    _directButton:  null,   // 直接领取按钮、关闭按钮
    _detailLabel:   null,   // 内容：车等级、武器等级
    _imageRoute:    null,   // 图片的路径
    _profit:        null,   // 收益：钻石数、零件数
    //_enterCallBack: null,   // 回调事件
    _animSpeed:     0.3,    // 动画速度
};

Popup.show = function (
    type,           // 弹窗类型:store、offLineProfit
    prefabRoute,    // 预制体路径
    profit,         // 收益
    detailString,   // 内容 string 类型
    imageRoute,     // 图片路径
    enterCallBack,  // 确定点击事件回调  function 类型
    //needCancel,     // 是否展示取消按钮 bool 类型 default YES
    animSpeed) {    // 动画速度 default = 0.3

    // 引用
    var self = this;

    // 判断
    if (Popup._popup != undefined) return;

    // 动画速度
    Popup._animSpeed = animSpeed ? animSpeed : Popup._animSpeed;

    // 加载 prefab 创建
    cc.loader.loadRes(prefabRoute, cc.Prefab, function (error, prefab) {
        if (error) {
            console.log("申请资源失败");
            return;
        }

        // 实例 
        var _popup = cc.instantiate(prefab);

        // Popup 持有
        Popup._popup = _popup;

        // 父视图
        Popup._popup.parent = cc.find("Canvas");

        // 动画 
        var cbFadeOut = cc.callFunc(self.onFadeOutFinish, self);
        var cbFadeIn = cc.callFunc(self.onFadeInFinish, self);
        self.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(Popup._animSpeed, 255), cc.scaleTo(Popup._animSpeed, 1)), cbFadeIn);
        self.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Popup._animSpeed, 0), cc.scaleTo(Popup._animSpeed, 2)), cbFadeOut);

        // 获取子节点并添加点击事件
        if(type == 'store'){
            enterCallBack();  //执行回调函数，初始化商店
            Popup._directButton = cc.find("closeButton", _popup);
            Popup._directButton.on('click', self.onButtonClicked, self);
            console.log("close button found");

        // }else if(type == 'newVehicle'){

        //     var dl= cc.find('vehicleName', _popup);
        //     if(!dl){
        //         console.log("节点为空");
        //     }else{
        //         //dl.getComponent(cc.Label) = detailString;   //设置新车辆名称
        //         dl.getComponent(cc.Label).string = detailString;
        //     }

        //     dl= cc.find('diamNum', _popup);
        //     if(!dl){
        //         console.log("节点为空");
        //     }else{
        //         dl.getComponent(cc.Label).string = profit; // 设置钻石数Label
        //     }

        //     dl= cc.find('newVehicle', _popup);
        //     if(!dl){
        //         console.log("节点为空");
        //     }else{
        //         // 设置新车辆图片
        //         cc.loader.loadRes(imageRoute, cc.SpriteFrame, function (err, texture) {
        //             if(err){
        //                 console.log(err);
        //             }                   
        //             dl.getComponent(cc.Sprite).spriteFrame = texture;
        //         });
        //     }

        //     Popup._directButton = cc.find("direct", _popup);
        //     Popup._directButton.on('click', self.onButtonClicked, self);

        }else if(type == 'offLineProfit'){

            var dl= cc.find('diamNum', _popup);
            if(!dl){
                console.log("节点为空");
            }else{
                dl.getComponent(cc.Label).string = profit; // 设置离线收益Label
            }

            Popup._directButton = cc.find("direct", _popup);
            Popup._directButton.on('click', self.onButtonClicked, self);

        }

        // 展现 alert
        self.startFadeIn();

        // 参数
        //self.configAlert(detailString, enterCallBack, needCancel, animSpeed);
        
    });

    // 参数
    // self.configAlert = function (detailString, enterCallBack, needCancel, animSpeed) {

    //     // 回调
    //     Popup._enterCallBack = enterCallBack;

    //     // 内容
    //     Popup._detailLabel.string = detailString;
    //     // 是否需要取消按钮
    //     if (needCancel || needCancel == undefined) { // 显示
    //         Popup._doubleButton.active = true;
    //     } else {  // 隐藏
    //         Popup._doubleButton.active = false;
    //         Popup._directButton.x = 0;
    //     }
    // };

    // 执行弹进动画
    self.startFadeIn = function () {
        cc.eventManager.pauseTarget(Popup._popup, true);
        Popup._popup.position = cc.p(0, 0);
        Popup._popup.setScale(2);
        //Alert._popup.opacity = 0;
        Popup._popup.runAction(self.actionFadeIn);
    };                  

    // 执行弹出动画
    self.startFadeOut = function () {
        cc.eventManager.pauseTarget(Popup._popup, true);

        
        if(type == 'store'){
            //摧毁scrollview里的所有项
            var temp;
            temp = Popup._popup.getChildByName("StoreScrollView");
            temp = temp.getChildByName("view");
            temp = temp.getChildByName("content");
            var temp2;
            //-------------------------------------------------------------------改成30
            for(var i = 1; i <= 10; i++){            
                temp2 = temp.getChildByName("item" + i);
                temp2.destroy();
            }
            Sound.PlaySound("Buzzer1");
            //Sound.PlaySound("touch");
        }else if(type == 'offLineProfit'){
            Sound.PlaySound("money");
        }
        
   
        Popup._popup.runAction(self.actionFadeOut);
    };

    // 弹进动画完成回调
    self.onFadeInFinish = function () {
        cc.eventManager.resumeTarget(Popup._popup, true);
    };

    // 弹出动画完成回调
    self.onFadeOutFinish = function () {
        self.onDestory();
    };

    // 按钮点击事件
    self.onButtonClicked = function(event){
       /* if(name=="ok"){
        console.log("确定按钮被电击");}
        }*/
        if(type == 'newVehicle'){
            enterCallBack();  //执行回调函数
        }
        self.startFadeOut();
    };

    // 销毁popup
    self.onDestory = function () {
        Popup._popup.destroy();
        Popup._type = null;
        //Popup._enterCallBack = null;
        Popup._popup = null;
        Popup._detailLabel = null;
        Popup._directButton = null;
        Popup._imageRoute = null;
        Popup._profit = null;
        //Popup._animSpeed = 0.3;
    };
};


