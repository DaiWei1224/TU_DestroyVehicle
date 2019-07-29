cc.Class({
    extends: cc.Component,

    //点击商店按钮
    storeBtnClick: function(){
        var self = this;

        Popup.show("store","prefab/Store","1","2","3",function(){
            var str = '';
            var weaponBuyNum = '';
            var price = 0;
            //初始化商店里所有武器的价格
            for(var i = 1; i <= 4; i++){
                str = 'weapon' + i;
                weaponBuyNum = self.getUserData(str, 0);
                //价格的设置有待更改------------------------------！！！！！！！！------------------------------
                price = 250 + weaponBuyNum * 50;
                var filename = "Canvas/Store/StoreScrollView/view/content/item" + i + "/buyButton/label";
                //console.log(filename);
                cc.find(filename).getComponent(cc.Label).string = price;

                var parts = cc.find("Canvas/Parts/part_label").getComponent(cc.Label).string;
                if(parseInt(parts) >= price){
                    filename = "Canvas/Store/StoreScrollView/view/content/item" + i + "/mask";
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
            //var num = weapon_info.weapon_nums[customEventData];
            var str = 'weapon' + (customEventData + 1);
            var num = self.getUserData(str, 0);
            var parts = cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
            //parts.string = parseInt(parts.string) - parseInt(weapon_info.getPrice(customEventData,num));
            var partsNum = parseInt(parts.string);
            var weaponPrice = parseInt(weapon_info.getPrice(customEventData,num));
            if(partsNum >= weaponPrice){
                partsNum -= weaponPrice;
                parts.string = partsNum;
                var filename="Canvas/Store/StoreScrollView/view/content/item" + parseInt(customEventData + 1)+"/buyButton/label";
                num ++;
                //购买后将最新的购买数量存到本地数据区
                cc.sys.localStorage.setItem(str, num); 
                //weapon_info.weapon_nums[customEventData] = num;
                var price = weapon_info.getPrice(customEventData,num);
                var pricelabel = cc.find(filename).getComponent(cc.Label);
                pricelabel.string = price;

                //检查所有购买按钮是否金钱不足需要变灰
                for(var i = 1; i <= 4; i++){
                    filename = "Canvas/Store/StoreScrollView/view/content/item" + i +"/buyButton/label";
                    price = parseInt(cc.find(filename).getComponent(cc.Label).string);
                    if(partsNum < price){
                        filename = "Canvas/Store/StoreScrollView/view/content/item" + i + "/mask";
                        cc.find(filename).active = true;
                    }
                } 
                
            }else{
                //console.log('金钱不足');
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
