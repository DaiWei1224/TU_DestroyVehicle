var Store = {
    _store: null,           // prefab
    _cancelButton: null,   // 取消按钮
    //_enterCallBack: null,   // 回调事件
    _animSpeed: 0.2,    // 动画速度
};

/**
 * enterCallBack:   确定点击事件回调  function 类型.
 * neeCancel:       是否展示取消按钮 bool 类型 default YES.
 * duration:        动画速度 default = 0.3.
*/
Store.show = function (enterCallBack, needCancel, animSpeed) {

    // 引用
    var self = this;

    // 判断
    if (Store._store != undefined) return;

    // 设置动画速度
    Store._animSpeed = animSpeed ? animSpeed : Store._animSpeed;

    // 加载 prefab 创建
    cc.loader.loadRes("prefab/Store", cc.Prefab, function (error, prefab) {

        if (error) {
            cc.error(error);
            return;
        }

        // 实例 
        var store = cc.instantiate(prefab);

        // Store 持有
        Store._store = store;

        // 动画 
        var cbFadeIn = cc.callFunc(self.onFadeInFinish, self);
        var cbFadeOut = cc.callFunc(self.onFadeOutFinish, self);
        self.actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(Store._animSpeed, 255), cc.scaleTo(Store._animSpeed, 1)), cbFadeIn);
        self.actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Store._animSpeed, 0), cc.scaleTo(Store._animSpeed, 0)), cbFadeOut);

        // 获取子节点
        Store._cancelButton = cc.find("CloseButton", store);

        // 添加点击事件
        Store._cancelButton.on('click', self.onButtonClicked, self);

        // 父视图
        Store._store.parent = cc.find("Canvas");

        // 展现 store
        self.startFadeIn();

        // 参数
        //self.configAlert(/*detailString,*/ enterCallBack, needCancel, /*animSpeed*/);
        
    });

    // 参数
    // self.configAlert = function (/*detailString,*/ enterCallBack, needCancel, /*animSpeed*/) {

    //     // 回调
    //     Alert._enterCallBack = enterCallBack;

    //     // 内容
    //     //Alert._detailLabel.string = detailString;
    //     // 是否需要取消按钮
    //     if (needCancel || needCancel == undefined) { // 显示
    //         Alert._cancelButton.active = true;
    //     } else {  // 隐藏
    //         Alert._cancelButton.active = false;
    //         Alert._enterButton.x = 0;
    //     }
    // };

    // 执行弹进动画
    self.startFadeIn = function () {
        cc.eventManager.pauseTarget(Store._store, true);//暂停传入的 node 相关的所有监听器的事件响应
        Store._store.position = cc.p(0, 0);
        Store._store.setScale(0);
        Store._store.opacity = 0;
        Store._store.runAction(self.actionFadeIn);
    };

    // 执行弹出动画
    self.startFadeOut = function () {
        cc.eventManager.pauseTarget(Store._store, true);
        Store._store.runAction(self.actionFadeOut);
    };

    // 弹进动画完成回调
    self.onFadeInFinish = function () {
        cc.eventManager.resumeTarget(Store._store, true);//恢复传入的 node 相关的所有监听器的事件响应
    };

    // 弹出动画完成回调
    self.onFadeOutFinish = function () {
        self.onDestory();
    };

    // 按钮点击事件
    self.onButtonClicked = function(event){
        // if(event.target.name == "enterButton"){
        //     if(self._enterCallBack){
        //         self._enterCallBack();
        //     }
        // }
        self.startFadeOut();
    };

    // 销毁 sotre (内存管理还没搞懂，暂且这样写吧~v~)
    self.onDestory = function () {
        Store._store.destroy();
        Store._store = null;
        Store._cancelButton = null;
        //Store._animSpeed = 0.3;
    };
};