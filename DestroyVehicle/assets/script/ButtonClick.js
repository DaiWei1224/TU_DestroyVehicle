cc.Class({
    extends: cc.Component,

    //点击商店按钮
    storeBtnClick: function(){
        var self = this;

        Popup.show("store","prefab/Store","1","2","3",function(){
            //var str = '';
            var weaponBuyNum = '';
            var price = 0;
            //获取当前武器最高等级
            var MaxArmRank = self.getUserData('MaxArmRank', 0);            
            //初始化商店里所有武器的价格
            console.log("MaxArmRank = " + MaxArmRank);
            if(MaxArmRank < 5){     //6级以下只能买第一级的武器
                var weaponBuyNum = weapon_info.weapon_nums[0];
                //根据武器等级和购买数量获取当前武器价格
                price = weapon_info.getPrice(0, parseInt(weaponBuyNum))
                //设置价格Label
                var filename = "Canvas/Store/StoreScrollView/view/content/item1/buyButton/label";
                cc.find(filename).getComponent(cc.Label).string = money.getlabel(price);
                //去掉“未解锁”蒙板
                filename = "Canvas/Store/StoreScrollView/view/content/item1/lockMask";
                cc.find(filename).active = false;
                //将武器图片从黑色设为白色
                filename = "Canvas/Store/StoreScrollView/view/content/item1/weapon";
                cc.find(filename).color = new cc.Color(255, 255, 255);
                //判断当前拥有零件数是否大于武器价格，大于则去掉灰色蒙板
                var parts = money.partnum;
                if(parseInt(parts) >= price){
                filename = "Canvas/Store/StoreScrollView/view/content/item1/mask";
                    cc.find(filename).active = false;
                }
            }
            else{
                MaxArmRank -= 2;    //6级及以上只能购买低两级的武器
                for(var i = 0; i <= MaxArmRank - 2; i++){       //零件购买
                    console.log("i = " + i + "，用零件购买");
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
                for(var i = MaxArmRank - 1; i <= MaxArmRank; i++){       //钻石购买
                    console.log("i = " + i + "，用钻石购买");
                    var weaponBuyNum = weapon_info.weapon_nums[i];
                    //根据武器等级和购买数量获取当前武器价格
                    price = weapon_info.getdiamondprice(i, parseInt(weaponBuyNum)) 
                    console.log("price =========" + price);              
                    //设置价格Label
                    var filename = "Canvas/Store/StoreScrollView/view/content/item" + (i + 1) + "/buyButton/label";
                    cc.find(filename).getComponent(cc.Label).string = money.getlabel(price);
                    //设置icon为钻石
                    var icon = cc.find("Canvas/Store/StoreScrollView/view/content/item" + (i + 1) + "/buyButton/label/sprite").getComponent(cc.Sprite);
                    filename = "/store/diamonds_icon";
                    cc.loader.loadRes(filename, cc.SpriteFrame, function (err, texture) {
                        if(err){
                            console.log(err);
                        }                   
                        icon.spriteFrame = texture;
                    });
                    //设置icon为钻石
                    if(i == MaxArmRank){
                        var icon2 = cc.find("Canvas/Store/StoreScrollView/view/content/item" + i + "/buyButton/label/sprite").getComponent(cc.Sprite);
                        filename = "/store/diamonds_icon";
                        cc.loader.loadRes(filename, cc.SpriteFrame, function (err, texture) {
                            if(err){
                                console.log(err);
                            }                   
                            icon2.spriteFrame = texture;
                        });
                    }
                    //去掉“未解锁”蒙板
                    filename = "Canvas/Store/StoreScrollView/view/content/item" + (i + 1) + "/lockMask";
                    cc.find(filename).active = false;
                    //将武器图片从黑色设为白色
                    filename = "Canvas/Store/StoreScrollView/view/content/item" + (i + 1) + "/weapon";
                    cc.find(filename).color = new cc.Color(255, 255, 255);
                    //判断当前拥有钻石数是否大于武器价格，大于则去掉灰色蒙板
                    var diamonds = money.diamondnum;
                    if(parseInt(diamonds) >= price){
                        filename = "Canvas/Store/StoreScrollView/view/content/item" + (i + 1) + "/mask";
                        cc.find(filename).active = false;
                    }
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
            //当前以及购买的数量
            var num = weapon_info.weapon_nums[customEventData];
            //获取当前最高武器等级
            var MaxArmRank = self.getUserData('MaxArmRank', 0);
            if(MaxArmRank < 5 || (customEventData < MaxArmRank - 3)){
                //零件购买
                //var str = 'weapon' + (customEventData + 1);
                //var num = self.getUserData(str, 0);
                var parts = cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
                //parts.string = parseInt(parts.string) - parseInt(weapon_info.getPrice(customEventData,num));
                var partsNum = money.partnum;
                var weaponPrice = parseInt(weapon_info.getPrice(customEventData,num));
                if(partsNum >= weaponPrice){
                    partsNum -= weaponPrice;
                    money.partnum = partsNum;
                    parts.string = money.getlabel(partsNum);
                    var filename="Canvas/Store/StoreScrollView/view/content/item" + parseInt(customEventData + 1)+"/buyButton/label";
                    num ++;
                    //购买后将最新的购买数量保存
                    weapon_info.weapon_nums[customEventData] = num;
                    //console.log(weapon_info.weapon_nums[customEventData]);
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
                    //console.log("所需"+autoBuyBtn.weapon_kind+"   "+autoBuyBtn.weapon_num)
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
                    //检查所有购买按钮是否零件不足需要变灰
                    //var MaxArmRank = parseInt(self.getUserData('MaxArmRank', 0));            
                    if(MaxArmRank < 5){
                        price = weapon_info.getPrice(0, weapon_info.weapon_nums[0]);
                        if(partsNum < price){
                            cc.find("Canvas/Store/StoreScrollView/view/content/item1/mask").active = true;                                     
                        }
                    }
                    else{
                        for(var i = 1; i < MaxArmRank - 2; i++){                                   
                            price = weapon_info.getPrice(i - 1, weapon_info.weapon_nums[i - 1]);
                            if(partsNum < price){
                                cc.find("Canvas/Store/StoreScrollView/view/content/item" + i + "/mask").active = true;                                     
                            }
                        }
                    }
                }else{
                    //console.log('金钱不足');
                }
            }else if((customEventData > MaxArmRank - 4) && (customEventData < MaxArmRank - 1)){
                //钻石购买
                //var str = 'weapon' + (customEventData + 1);
                //var num = self.getUserData(str, 0);
                var diamonds = cc.find("Canvas/Diamonds/diamond_label").getComponent(cc.Label);
                //parts.string = parseInt(parts.string) - parseInt(weapon_info.getPrice(customEventData,num));
                var diamondsNum =money.diamondnum;
                var weaponPrice = parseInt(weapon_info.getdiamondprice(customEventData,num));
                if(diamondsNum >= weaponPrice){
                    diamondsNum -= weaponPrice;
                    money.diamondnum = diamondsNum;
                    diamonds.string = money.getlabel(diamondsNum);
                    var filename="Canvas/Store/StoreScrollView/view/content/item" + parseInt(customEventData + 1)+"/buyButton/label";
                    num ++;
                    //购买后将最新的购买数量保存
                    weapon_info.weapon_nums[customEventData] = num;
                    //console.log(weapon_info.weapon_nums[customEventData]);
                    var price = weapon_info.getdiamondprice(customEventData,num);
                    var pricelabel = cc.find(filename).getComponent(cc.Label);
                    pricelabel.string = money.getlabel(price);
                    //检查所有购买按钮是否金钱不足需要变灰
                    //var MaxArmRank = parseInt(self.getUserData('MaxArmRank', 0));            
                    for(var i = MaxArmRank - 2; i < MaxArmRank; i++){                                   
                        price = weapon_info.getdiamondprice(i - 1, weapon_info.weapon_nums[i - 1]);
                        if(diamondsNum < price){
                            cc.find("Canvas/Store/StoreScrollView/view/content/item" + i + "/mask").active = true;                                     
                        }
                    }
                }else{
                    //console.log('金钱不足');
                }

            }
 
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
            var MaxArmRank = this.getUserData('MaxArmRank', 0); 
            //console.log("money.partnum="+money.partnum);
            if(MaxArmRank < 5){     //小于6级
                //检查零件购买
                var Money = money.partnum;
                var price = weapon_info.getPrice(0, weapon_info.weapon_nums[0]);
                if(Money >= price){
                    cc.find("Canvas/Store/StoreScrollView/view/content/item1/mask").active = false;
                }
            }else{                  //大于等于6级
                //检查零件购买
                var Money = money.partnum;
                for(var i = 1; i <= MaxArmRank - 3; i++){
                    var price = weapon_info.getPrice(i - 1, weapon_info.weapon_nums[i - 1]);
                    if(Money >= price){
                        cc.find("Canvas/Store/StoreScrollView/view/content/item" + i + "/mask").active = false;
                    }
                }
                //检查钻石购买
                Money = money.diamondnum;
                for(i = MaxArmRank - 2; i <= MaxArmRank - 1; i++){
                    price = weapon_info.getdiamondprice(i - 1, weapon_info.weapon_nums[i - 1]);
                    if(Money >= price){
                        cc.find("Canvas/Store/StoreScrollView/view/content/item" + i + "/mask").active = false;
                    }
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
