cc.Class({
    extends: cc.Component,

    //点击商店按钮
    storeBtnClick: function(){
        var self = this;

        Popup.show("store","prefab/Store","1","2","3",function(){
            var str = '';
            var weaponBuyNum = '';
            var price = 0;
            //获取当前武器最高等级
            var MaxArmRank = self.getUserData('MaxArmRank', 0);            
            //初始化商店里所有武器的价格
            if(MaxArmRank < 5){
                MaxArmRank = 0;     //6级以下只能买第一级的武器
            }
            else{
                MaxArmRank -= 2;    //6级及以上只能购买低两级的武器
            }
            for(var i = 0; i <= MaxArmRank; i++){
                //str = 'weapon' + (i + 1);
                //weaponBuyNum = self.getUserData(str, 1);//默认值1代表要购买第1个武器
                var weaponBuyNum = weapon_info.weapon_nums[i];

                //根据武器等级和购买数量获取当前武器价格
                price = weapon_info.getPrice(i, parseInt(weaponBuyNum))
                //设置价格Label
                var filename = "Canvas/Store/StoreScrollView/view/content/item" + (i + 1) + "/buyButton/label";
                cc.find(filename).getComponent(cc.Label).string = money.getlabel(price);
                console.log('已经购买' + weaponBuyNum + '把武器' + (i + 1) + '，当前价格为' + price);
                //去掉“未解锁”蒙板
                filename = "Canvas/Store/StoreScrollView/view/content/item" + (i + 1) + "/lockMask";
                cc.find(filename).active = false;
                //将武器图片从黑色设为白色
                filename = "Canvas/Store/StoreScrollView/view/content/item" + (i + 1) + "/weapon";
                cc.find(filename).color = new cc.Color(255, 255, 255);
                //判断当前拥有零件数是否大于武器价格，大于则去掉灰色蒙板
                var parts=money.partnum;
                if(parseInt(parts) >= price){
                    filename = "Canvas/Store/StoreScrollView/view/content/item" + (i + 1) + "/mask";
                    cc.find(filename).active = false;
                }

            }
            

        });
    },

    //点击购买武器
    weaponBtnClick: function(event,customEventData){
        var self = this;
        var CM = require("CombineManager");
        var flag = CM.InstNewArm(customEventData);
        //返回1代表还有空位，可以初始化
        if(flag == "1")
        {
            //console.log(customEventData);
            customEventData = parseInt(customEventData);
            var num = weapon_info.weapon_nums[customEventData];
            var str = 'weapon' + (customEventData + 1);
            //var num = self.getUserData(str, 0);
            var parts = cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
            //parts.string = parseInt(parts.string) - parseInt(weapon_info.getPrice(customEventData,num));
            var partsNum =money.partnum;
            var weaponPrice = parseInt(weapon_info.getPrice(customEventData,num));
            if(partsNum >= weaponPrice){
                partsNum -= weaponPrice;
                money.partnum = partsNum;
                parts.string = money.getlabel(partsNum);
                var filename="Canvas/Store/StoreScrollView/view/content/item" + parseInt(customEventData + 1)+"/buyButton/label";
                num ++;
                //购买后将最新的购买数量存到本地数据区
                //cc.sys.localStorage.setItem(str, num); 
                weapon_info.weapon_nums[customEventData] = num;
                console.log(weapon_info.weapon_nums[customEventData]);
                var price = weapon_info.getPrice(customEventData,num);
                var pricelabel = cc.find(filename).getComponent(cc.Label);
                pricelabel.string = money.getlabel(price);
                //重新计算最优购买武器
                var autoBuyBtn = cc.find("Canvas/autobuyButton");
                autoBuyBtn.weapon_kind = weapon_info.changeweapon();
                //更新打击后价格
                var priceLabel = cc.find("Canvas/autobuyButton/priceLabel").getComponent(cc.Label);
                autoBuyBtn.weapon_num = weapon_info.weapon_nums[autoBuyBtn.weapon_kind];
                priceLabel.string = money.getlabel(weapon_info.getPrice(autoBuyBtn.weapon_kind, autoBuyBtn.weapon_num));
                console.log("所需"+autoBuyBtn.weapon_kind+"   "+autoBuyBtn.weapon_num)
                //更新最优武器图片
                var weaponImage = cc.find("Canvas/autobuyButton/Sprite").getComponent(cc.Sprite);
                if(parseInt(autoBuyBtn.weapon_kind) + 1 < 10){
                    filename = "/weapon/weapon0" + (parseInt(autoBuyBtn.weapon_kind) + 1);
                }else{
                    filename = "/weapon/weapon" + (parseInt(autoBuyBtn.weapon_kind) + 1);
                }
                cc.loader.loadRes(filename, cc.SpriteFrame, function (err, texture) {
                    if(err){
                        console.log(err);
                    }                   
                    weaponImage.spriteFrame = texture;
                });

                var MaxArmRank = parseInt(self.getUserData('MaxArmRank', 0));            
                //初始化商店里所有武器的价格
                if(MaxArmRank < 5){
                    MaxArmRank = 0;     //6级以下只能买第一级的武器
                }
                else{
                    MaxArmRank -= 2;    //6级及以上只能购买低两级的武器
                }
                
                //检查所有购买按钮是否金钱不足需要变灰
                for(var i = 1; i <= MaxArmRank + 1; i++){                                   
                    price = weapon_info.getPrice(i - 1, weapon_info.weapon_nums[i - 1]);
                    if(partsNum < price){
                        cc.find("Canvas/Store/StoreScrollView/view/content/item" + i + "/mask").active = true;                                     
                    }
                }
                
            }else{
                //console.log('金钱不足');
            }
            
        }
        
        
        
    },

    sleep: function(delay) {
        var start = (new Date()).getTime();
        while ((new Date()).getTime() - start < delay) {
            continue;
        }
    },

    onLoad(){
        this.count = 0;
    },

    update(dt){
        this.count++;
        if(this.count = 60){    //60秒刷新一次商店的按钮
            this.count = 0;
            //检查所有购买按钮金钱足够则去掉蒙板
            var partsNum = money.partnum;
            for(var i = 1; i <= 30 + 1; i++){
                 var price = weapon_info.getPrice(i - 1, weapon_info.weapon_nums[i - 1]);
                if(partsNum >= price){
                    cc.find("Canvas/Store/StoreScrollView/view/content/item" + i + "/mask").active = false;
                }
            }
        }
    },

    getUserData: function(key, dft) {    
        var value = cc.sys.localStorage.getItem(key);

        if(value == "" || value == null){         
            return dft;
        }else{
            return value;
        }
    },

});
