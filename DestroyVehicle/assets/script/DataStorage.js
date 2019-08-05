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
        speed: {
            default: null,
            type: cc.Label,
            displayName: "速度Label"
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
        //这个调用记得删！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！1111111
        this.InitializationTest();

        //登陆读取用户数据
        var self = this;
        var date1 = 0; //离线时间
        var date2 = 0; //上线时间
        //读取钻石数
        money.diamondnum=self.getUserData("diamonds",0);
        //self.diamonds.string = self.getUserData("diamonds",0);
        self.diamonds.string=money.getlabel(money.diamondnum);
        //读取零件数
        money.partnum = parseInt(self.getUserData("parts", 90));
        self.parts.string=money.getlabel(money.partnum);
        //读取零件增加速度
        money.speednum = self.getUserData("partsSpeed", 2.5);
        self.speed.string = '+' + money.getlabel(money.speednum) + '/s';
        console.log("读取的速率"+money.speednum);
    
        //console.log("零件数"+money.partnum);
        //初始化weapon_info.weapon_num数组
        var MaxArmRank = self.getUserData("MaxArmRank", 0);
        weapon_info.level_now =parseInt(MaxArmRank);
        for(var i = 0; i <= MaxArmRank; i++){
            weapon_info.weapon_nums[i] = self.getUserData("weapon" + (i + 1), 1);

        }

        //计算离线时点收益
        date1 = self.getUserData("leaveDate", 0);
        if(date1 != 0){
            date2 = new Date().getTime(); //返回页面的时间
            var leaveTime = parseInt((date2 - date1) / 1000);
            console.log("距离上次登陆 " + leaveTime + " 秒");
            if(leaveTime > 7200){  //设置最大离线收益时间为2小时
                leaveTime = 7200;
            }
            //计算离线收益速率
            var offLineSpeed = parseFloat(money.speednum) - parseInt(weapon_info.getatk(MaxArmRank)) / 2;
            //console.log("工人速度" + parseInt(weapon_info.getatk(MaxArmRank)) / 2);
            //console.log("收益速度" + offLineSpeed + "   离线时间" + leaveTime);
            money.partnum += leaveTime * offLineSpeed;

            self.parts.string = money.getlabel(money.partnum);   //将更新后的零件数保存到label
            //弹窗提示离线收益
            Popup.show('offLineProfit', 'prefab/OffLineRevenue', money.getlabel(leaveTime * offLineSpeed)+'','emmm');
        }

        
        

        //读取关卡数，默认值为1
        self.level.string = "Lv." + self.getUserData("level", "1");
        //读取剩余血量
        var read = parseInt(self.getUserData("restBlood", 100));
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

    InitializationTest: function(){
        cc.sys.localStorage.setItem("level", 1);
        cc.sys.localStorage.setItem("diamonds", 0);
        cc.sys.localStorage.setItem("parts", 90);
        cc.sys.localStorage.setItem("restBlood",100);
        cc.sys.localStorage.setItem("allBlood",100);
        cc.sys.localStorage.setItem("MaxArmRank", 0);
        cc.sys.localStorage.setItem("partsSpeed", 5);
        cc.sys.localStorage.setItem("weapon1", 1);
        cc.sys.localStorage.setItem("weapon2", 1);
        cc.sys.localStorage.setItem("weapon3", 1);
        cc.sys.localStorage.setItem("weapon4", 1);
        cc.sys.localStorage.setItem("weapon5", 1);
        cc.sys.localStorage.setItem("weapon6", 1);
        cc.sys.localStorage.setItem("weapon7", 1);
        cc.sys.localStorage.setItem("weapon8", 1);
        cc.sys.localStorage.setItem("weapon9", 1);
        cc.sys.localStorage.setItem("weapon10", 1);
        cc.sys.localStorage.setItem("leaveDate", 0); 
        cc.sys.localStorage.setItem("recentReceiveDate", 1);
        cc.sys.localStorage.setItem("receiveDayNum", 0);

    },

    //存储数据
    setUserData: function(){
        //保存离开时的时间(1970 年 1 月 1 日至今的毫秒数)
        cc.sys.localStorage.setItem("leaveDate", new Date().getTime()); 
        cc.sys.localStorage.setItem("diamonds", parseInt(money.partnum)); 
        cc.sys.localStorage.setItem("parts", parseInt(money.diamondnum)); 
        //将Lv.1根据'.'分成两部分，后面那部分为temp[1]，代表关卡数，取为整型数
        var temp = this.level.string.split('.');
        cc.sys.localStorage.setItem("level", parseInt(temp[1]));
        //若当前血量为60/100，则restBlood=60，allBlood=100
        temp = this.blood.string.split('/');
        cc.sys.localStorage.setItem("restBlood",parseInt(temp[0]));
        cc.sys.localStorage.setItem("allBlood",parseInt(temp[1]));
        cc.sys.localStorage.setItem("partsSpeed",money.speednum);
        //获取武器的最高等级
        temp = this.getUserData("MaxArmRank", 0);
        //存储各种武器购买的数量
        for(var i = 0; i <= temp; i++){
            cc.sys.localStorage.setItem("weapon" + (i + 1), weapon_info.weapon_nums[i]);
        }
        //存储每个坑位对应的武器
        var slotState= cc.find("Canvas/SlotManager").getComponent("CombineManager");
        //console.log(slotState.ArmArry);   
        var slot = {
            slot01: slotState.ArmArry[0],
            slot02: slotState.ArmArry[1],
            slot03: slotState.ArmArry[2],
            slot04: slotState.ArmArry[3],
            slot05: slotState.ArmArry[4],
            slot06: slotState.ArmArry[5],
            slot07: slotState.ArmArry[6],
            slot08: slotState.ArmArry[7],
            slot09: slotState.ArmArry[8],
            slot10: slotState.ArmArry[9],
            slot11: slotState.ArmArry[10],
            slot12: slotState.ArmArry[11],
        }   
        cc.sys.localStorage.setItem('slot',JSON.stringify(slot));

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