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
        }
        //读取关卡数，默认值为1
        self.level.string = "Lv." + self.getUserData("level", "1");



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

        // onShow  onhide   -    wx  (  onshow    )
        // creator  -  
        
        // scene game  -  
        // ondestory
        // prefab -  

        // save  ---   
        
        //  getitem - "parts"    (  default  )
        //  test : function ( a , default  )

        // test ( "parts" , "2" )
        //   --  "2 "


        // setitem  -- conin = 10 
        // 10 

        //  save : function (){
              // 1 // 2 // 3 
        // }

        //    state ---  wait on out hide move 

        //    update --  if (    ) 
        //    this.a = wait ;  // on  // 
        
        //  1 : wx   2 : 