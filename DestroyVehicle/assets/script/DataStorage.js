cc.Class({
    extends: cc.Component,

    properties: {

        parts: {
            default: null,
            type: cc.Label,
            displayName: "零件Label"
        },
    },

    onLoad () {
        //登陆读取用户数据
        var self = this;
        var date1 = 0; //离线时间
        var date2 = 0; //上线时间

        var a = parseInt(this.getUserData("parts", 0));
        console.log("读取到coin = " + a);

        date1 = self.getUserData("leaveDate", 0);
        if(date1 != 0){
            date2 = new Date().getTime(); //返回页面的时间
            var leaveTime = parseInt((date2 - date1) / 1000);
            console.log("离线 " + leaveTime + "秒");

            a += leaveTime * 5;
            self.parts.string = a;   //将更新后的零件数保存到label


        }

        //离开页面
        cc.game.on(cc.game.EVENT_HIDE, function () {

            self.setUserData();                
        });

        //回到页面
        cc.game.on(cc.game.EVENT_SHOW, function () {

            date1 = self.getUserData("leaveDate", 0)

            if(date1 != 0){
                date2 = new Date().getTime(); //返回页面的时间
                var leaveTime = parseInt((date2 - date1) / 1000);
                console.log("离线 " + leaveTime + "秒");

                var a = parseInt(self.parts.string);
                a += leaveTime * 5;
                self.parts.string = a;   //将更新后的零件数保存到label
                cc.sys.localStorage.setItem("parts", a);
            }
        });

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

    //存储数据
    setUserData: function(){
        //保存离开时的时间(1970 年 1 月 1 日至今的毫秒数)
        cc.sys.localStorage.setItem("leaveDate", new Date().getTime()); 

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