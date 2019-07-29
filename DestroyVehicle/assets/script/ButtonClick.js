cc.Class({
    extends: cc.Component,

    //点击商店按钮
    storeBtnClick: function(){
        Popup.show("store","prefab/Store","1","2","3",function(){
            //点击商店按钮后执行回调函数，在Popup里添加，初始化每个按钮的零件值
            console.log("假装初始化了每个按钮的零件数");

        });
    },
    //点击购买武器1
    weapon01BtnClick: function(event,customEventData){
        var abc=require("CombineManager");
        var flag=abc.InstNewArm(customEventData);
        if(flag=="1")
        {
            console.log(customEventData);
        customEventData=parseInt(customEventData);
        var num=weapon_info.weapon_nums[customEventData];
        var parts=cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
        parts.string=parseInt(parts.string)-parseInt(weapon_info.getPrice(customEventData,num));
        var filename="Canvas/Store/StoreScrollView/view/content/item0"+parseInt(customEventData+1)+"/buyButton/label";
        num=num+1;
        console.log(num);
        weapon_info.weapon_nums[customEventData]=num;
        var price=weapon_info.getPrice(customEventData,num);
        
        var pricelabel=cc.find(filename).getComponent(cc.Label);
        pricelabel.string=price;
        
        console.log(filename);
        console.log("zheliang车的价格是"+price);
        
        console.log("假装购买了人字拖233");
        }
        
        
    },
});
