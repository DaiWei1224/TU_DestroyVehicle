cc.Class({
    extends: cc.Component,

    properties: {
        
        SignInWindow: {
            default: null,
            type: cc.Node,
            displayName: "签到窗口",
        },
        LeftList: {
            default: null,
            type: cc.Node,
            displayName: "左侧栏",
        },
        mask: cc.Node,
        listBtn: cc.Node,
        diamondLabel: {
            default: null,
            type: cc.Label,
        },
        windowSpeed: 0.2,
    },

    onLoad () {
        //第一次登陆不出现签到弹窗
        if(this.getUserData("MaxArmRank", 0) == 0){
            this.SignInWindow.active = false;
            //将可领取的项label改为可领取，并添加光圈
            cc.find("SignIn/aWeek/day1/title").getComponent(cc.Label).string = "可领取";
            cc.find("SignIn/aWeek/day1/light").active = true;
            return;
        }
        var self = this;
        //获取当前日期
        var nowDate = new Date().getDate(); //从Date对象返回一个月中的某一天 (1 ~ 31)
        //读取上一次领取的日期, 默认值为0
        var recentReceiveDate = self.getUserData("recentReceiveDate", 0);
        //读取已领取天数, 默认值为0
        var receiveDayNum = self.getUserData("receiveDayNum", 0);
        //判断当前日期和上一次领取日期是否相等
        if(nowDate == recentReceiveDate){   //相等
            self.SignInWindow.active = false;
            for(var i = 1; i <= receiveDayNum; i++){
                //将已领取的项设为已领取
                cc.find("SignIn/aWeek/day" + i + "/title").getComponent(cc.Label).string = "已领取";
                //添加蒙板
                cc.find("SignIn/aWeek/day" + i + "/mask").active = true;
            }
            //隐藏领取按钮，显示label
            cc.find("SignIn/direct").active = false;
            cc.find("SignIn/receivedLabel").active = true;
        }else{  //不相等
            //弹出签到弹窗
            //self.SignInWindow.active = true;
            var actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(self.windowSpeed, 255), cc.scaleTo(self.windowSpeed, 1)),null);//, cbFadeIn);
            self.SignInWindow.runAction(actionFadeIn);
            //若已领取天数为7，则改为0
            if(receiveDayNum == 7){
                receiveDayNum = 0;
                cc.sys.localStorage.setItem("receiveDayNum", 0);
            }
            //将已领取的项label改为已领取，并添加蒙板
            var i = 1;
            for(; i <= receiveDayNum; i++){
                //将已领取的项设为已领取
                cc.find("SignIn/aWeek/day" + i + "/title").getComponent(cc.Label).string = "已领取";
                //添加蒙板
                cc.find("SignIn/aWeek/day" + i + "/mask").active = true;
            }
            //将可领取的项label改为可领取，并添加光圈
            cc.find("SignIn/aWeek/day" + i + "/title").getComponent(cc.Label).string = "可领取";
            cc.find("SignIn/aWeek/day" + i + "/light").active = true;
        }
    },

    //点击签到按钮
    clickSignInBtn: function() {
        Sound.PlaySound("touch");
        var self = this;
        self.SignInWindow.active = true;
        //窗口进入动画
        var actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(self.windowSpeed, 255), cc.scaleTo(self.windowSpeed, 1)),null);//, cbFadeIn);
        self.SignInWindow.runAction(actionFadeIn);

        self.listBtn.getComponent('LeftListClick').OuterClick = true;
        self.LeftList.runAction(cc.moveBy(0.1,-150,0));    
        self.scheduleOnce(function(){
            self.mask.active = false;
        },0.1);
    },
    //点击领取按钮
    clickReceiveBtn: function() {
        //读取上一次领取的日期, 默认值为1
        var recentReceiveDate = this.getUserData("recentReceiveDate", 0);
        //读取已领取天数, 默认值为0
        var receiveDayNum = this.getUserData("receiveDayNum", 0);
        //加钻石
        Sound.PlaySound("diamond");
        /*if(receiveDayNum == 6){
            money.diamondnum += 80;
            this.diamondLabel.string = money.getlabel(money.diamondnum);
        }else{
            money.diamondnum += 10;
            this.diamondLabel.string = money.getlabel(money.diamondnum);
        }*/
        switch(receiveDayNum){
            case '0': money.diamondnum = parseInt(money.diamondnum) + 400; break;
            case '1': money.diamondnum = parseInt(money.diamondnum) + 450; break;
            case '2': money.diamondnum = parseInt(money.diamondnum) + 500; break;
            case '3': money.diamondnum = parseInt(money.diamondnum) + 550; break;
            case '4': money.diamondnum = parseInt(money.diamondnum) + 600; break;
            case '5': money.diamondnum = parseInt(money.diamondnum) + 650; break;
            case '6': money.diamondnum = parseInt(money.diamondnum) + 800; break;
        }
        this.diamondLabel.string = money.getlabel(money.diamondnum);				
          
        //将领取消光圈取后的项改为已领取并添加蒙板
        cc.find("SignIn/aWeek/day" + (parseInt(receiveDayNum) + 1) + "/light").active = false;
        cc.find("SignIn/aWeek/day" + (parseInt(receiveDayNum) + 1) + "/title").getComponent(cc.Label).string = "已领取";
        cc.find("SignIn/aWeek/day" + (parseInt(receiveDayNum) + 1) + "/mask").active = true;
        //将领取按钮隐藏并显示label
        cc.find("SignIn/direct").active = false;
        cc.find("SignIn/receivedLabel").active = true;
        //存储数据
        cc.sys.localStorage.setItem("recentReceiveDate", new Date().getDate());
        cc.sys.localStorage.setItem("receiveDayNum", parseInt(receiveDayNum) + 1);
    },
    //点击签到窗口关闭按钮
    clickCloseBtn: function() {
        //窗口退出动画
        Sound.PlaySound("touch");
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.windowSpeed, 0), cc.scaleTo(this.windowSpeed, 2)),null);//, cbFadeOut);
        this.SignInWindow.runAction(actionFadeOut);
        this.scheduleOnce(function(){
            this.SignInWindow.active = false;
        },0.6);
    },

    //获取key对应的数据，为空设为默认值dft
    getUserData: function(key, dft) {    

        var value = cc.sys.localStorage.getItem(key);

        if(value == "" || value == null){         
            return dft;
        }else{
            return value;
        }
    },

});
