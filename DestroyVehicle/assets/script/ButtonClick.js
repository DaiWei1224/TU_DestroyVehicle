cc.Class({
    extends: cc.Component,

    //点击商店按钮
    storeBtnClick: function(){
        Popup.show("store","prefab/Store",);
    },
    //点击购买武器1
    weapon01BtnClick: function(){
        console.log("假装购买了人字拖233");
    },
});
