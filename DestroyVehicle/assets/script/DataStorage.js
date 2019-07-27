cc.Class({
    extends: cc.Component,

    properties: {

        parts: {
            default: null,
            type: cc.Label,
            displayName: "零件Label"
        },
        diamonds: {
            default: null,
            type: cc.Label,
            displayName: "钻石Label"
        },
        level: {
            default: null,
            type: cc.Label,
            displayName: "当前关卡数",
        },
        blood: {
            default: null,
            type: cc.Label,
            displayName: "血量Label",
        },
        bloodProgress: {
            default: null,
            type: cc.ProgressBar,
            displayName: "血量进度条",
        },
        percentageLabel: {
            default: null,
            type: cc.Label,
            displayName: "剩余血量百分比"
        },
    },

    onLoad () {
        //登陆读取用户数据
        var self = this;
        var date1 = 0; //离线时间
        var date2 = 0; //上线时间

        //读取钻石数
        self.diamonds.string = self.getUserData("diamonds",0);
        //读取零件数
        var read = parseInt(self.getUserData("parts", 0));
        //计算离线时点收益
        date1 = self.getUserData("leaveDate", 0);
        if(date1 != 0){
            date2 = new Date().getTime(); //返回页面的时间
            var leaveTime = parseInt((date2 - date1) / 1000);
            console.log("距离上次登陆 " + leaveTime + " 秒");
            read += leaveTime * 5;
            self.parts.string = read;   //将更新后的零件数保存到label

            console.log(self.parts.string);
            //弹窗提示离线收益
            Popup.show('offLineProfit', 'prefab/OffLineRevenue', (leaveTime * 5)+'','1');
        }

        //读取关卡数，默认值为1
        self.level.string = "Lv." + self.getUserData("level", "1");
        //读取剩余血量
        read = parseInt(self.getUserData("restBlood", 100));
        //读取总血量
        var read2 = parseInt(self.getUserData("allBlood", 100));
        //设置血量Label
        self.blood.string = read + '/' + read2;
        //设置进度条
        self.bloodProgress.progress = read / read2;
        //设置剩余血量备份比
        self.percentageLabel.string = parseInt(self.bloodProgress.progress * 100) + '%';

        //对离开页面进行监听
        cc.game.on(cc.game.EVENT_HIDE, function () {
            //离开时保存用户数据
            self.setUserData();
        });

        //对回到页面进行监听
        cc.game.on(cc.game.EVENT_SHOW, function () {

            date1 = self.getUserData("leaveDate", 0)

            if(date1 != 0){
                date2 = new Date().getTime(); //返回页面的时间
                var leaveTime = parseInt((date2 - date1) / 1000);
                console.log("离线 " + leaveTime + " 秒");
                read= parseInt(self.parts.string);
                read += leaveTime * 5;
                self.parts.string = read;   //将更新后的零件数保存到label
                cc.sys.localStorage.setItem("parts", read);
            }
        });

    },

    //存储数据
    setUserData: function(){
        //保存离开时的时间(1970 年 1 月 1 日至今的毫秒数)
        cc.sys.localStorage.setItem("leaveDate", new Date().getTime()); 
        cc.sys.localStorage.setItem("diamonds", parseInt(this.diamonds.string)); 
        cc.sys.localStorage.setItem("parts", parseInt(this.parts.string)); 
        //将Lv.1根据'.'分成两部分，后面那部分为temp[1]，代表关卡数，取为整型数
        var temp = this.level.string.split('.');
        cc.sys.localStorage.setItem("level", parseInt(temp[1]));
        //若当前血量为60/100，则restBlood=60，allBlood=100
        temp = this.blood.string.split('/');
        cc.sys.localStorage.setItem("restBlood",parseInt(temp[0]));
        cc.sys.localStorage.setItem("allBlood",parseInt(temp[1]));
        

        //存储武器的最高等级
        //????????????????????

        // //存储各种武器购买的数量
        // var weaponBuyNum = {
        //     weapon01: 0,
        //     weapon02: 0,
        //     weapon03: 0,
        //     weapon04: 0,
        //     weapon05: 0,
        //     weapon06: 0,
        //     weapon07: 0,
        //     weapon08: 0,
        //     weapon09: 0,
        //     weapon10: 0,
        //     weapon11: 0,
        //     weapon12: 0,
        //     weapon13: 0,
        //     weapon14: 0,
        //     weapon15: 0,
        //     weapon16: 0,
        //     weapon17: 0,
        //     weapon18: 0,
        //     weapon19: 0,
        //     weapon20: 0,
        //     weapon21: 0,
        //     weapon22: 0,
        //     weapon23: 0,
        //     weapon24: 0,
        //     weapon25: 0,
        //     weapon26: 0,
        //     weapon27: 0,
        //     weapon28: 0,
        //     weapon29: 0,
        //     weapon30: 0
        // };
        // cc.sys.localStorage.setItem('weaponBuyNum',JSON.stringify(weaponBuyNum));
        // //读取
        // var weaponBuyNum = JSON.parse(cc.sys.localStorage.getItem('weaponBuyNum'));
        // console.log(weaponBuyNum.weapon01);

        // //存储每个坑位对应的武器
        // var slot = {
        //     slot01: 0,
        //     slot02: 0,
        //     slot03: 0,
        //     slot04: 0,
        //     slot05: 0,
        //     slot06: 0,
        //     slot07: 0,
        //     slot08: 0,
        //     slot09: 0,
        //     slot10: 0,
        //     slot11: 0,
        //     slot12: 0,
        // }        
    },

    //获取key对应的数据，为空设为默认值dft
    getUserData: function(key, dft) {    

        var value = cc.sys.localStorage.getItem(key);

        if(value == "" || value == null){         
            //console.log("no exist");
            return dft;
        }else{
            //console.log("exist");
            return value;
        }
    },

});