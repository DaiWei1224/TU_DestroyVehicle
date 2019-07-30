cc.Class({
    extends: cc.Component,

    properties: {
        weapon_kind:0,
        weapon_num:1,
        mask:cc.Node,
        label:cc.Node,

    },

    onLoad () {
        
    },

    start () {
        //console.log("这个程序开始执行了");
        var self = this;

        //初始化按键信息
        self.weapon_kind = parseInt(weapon_info.changeweapon());
        self.weapon_num = parseInt(weapon_info.weapon_nums[self.weapon_kind]);
        //console.log(self.weapon_kind+ "    "+ self.weapon_num);
        var price=cc.find("Canvas/autobuyButton/priceLabel").getComponent(cc.Label);
        price.string=weapon_info.getPrice(self.weapon_kind,self.weapon_num);//更新打击后价格
        //更新最优武器图片
        var weaponImage = cc.find("Canvas/autobuyButton/Sprite").getComponent(cc.Sprite);
        if(parseInt(self.weapon_kind) + 1 < 10){
            var filename = "/weapon/weapon0" + (parseInt(self.weapon_kind) + 1);
        }else{
            var filename = "/weapon/weapon" + (parseInt(self.weapon_kind) + 1);
        }
        cc.loader.loadRes(filename, cc.SpriteFrame, function (err, texture) {
            if(err){
                console.log(err);
            }                   
            weaponImage.spriteFrame = texture;
        });


        var price=cc.find("Canvas/autobuyButton/priceLabel").getComponent(cc.Label);
        price.string = weapon_info.getPrice(self.weapon_kind,self.weapon_num);
        self.node.on("touchstart",function(){
            //console.log("触摸程序执行了");

            self.weapon_num = parseInt(weapon_info.weapon_nums[self.weapon_kind]);

            var sets=cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
            var sets_num=sets.string;
            //var price=cc.find("New Canvas/auto_buy/auto_lable").getComponent(cc.Label);
            sets_num-=price.string;

            //console.log("已经购买了编号为"+self.weapon_kind+"的武器，此时已经购买了"+self.weapon_num+"把");
            self.weapon_num+=1;
            weapon_info.weapon_nums[self.weapon_kind] = self.weapon_num;
            sets.string=sets_num;//扣钱
            //console.log("现在还剩"+sets.string+"个零件");
            var abc=require("CombineManager");
            var flag=abc.InstNewArm(self.weapon_kind);
            //console.log(flag);
            if(flag == '1')
            {
                self.weapon_kind = weapon_info.changeweapon();
                //console.log("编号为"+self.weapon_kind);
                self.weapon_num = weapon_info.weapon_nums[self.weapon_kind];
                //更新打击后价格
                price.string=weapon_info.getPrice(self.weapon_kind,self.weapon_num);
                //更新最优武器图片
                var weaponImage = cc.find("Canvas/autobuyButton/Sprite").getComponent(cc.Sprite);
                if(parseInt(self.weapon_kind) + 1 < 10){
                    var filename = "/weapon/weapon0" + (parseInt(self.weapon_kind) + 1);
                }else{
                    var filename = "/weapon/weapon" + (parseInt(self.weapon_kind) + 1);
                }
                cc.loader.loadRes(filename, cc.SpriteFrame, function (err, texture) {
                    if(err){
                        console.log(err);
                    }                   
                    weaponImage.spriteFrame = texture;
                });



                if(sets_num < parseInt(price.string)){
                    //console.log("钱不够再买了")
                    self.mask.active=true;
                }
                else{
                    // console.log(sets_num);
                    // console.log(price.string);
                    // console.log("金钱充足");
                }
                    
            }
    
            
           
        },self)
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
