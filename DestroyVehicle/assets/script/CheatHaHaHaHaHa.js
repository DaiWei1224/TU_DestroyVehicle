cc.Class({
    extends: cc.Component,

    properties: {
        num: 1,
    },

    clickCheatingButton() {
        if(this.num == 10){
            money.partnum = parseInt(money.partnum) + 10000000;
            money.diamondnum = parseInt(money.diamondnum) + 10000;
            cc.find("Canvas/Parts/part_label").getComponent(cc.Label).string = money.getlabel(money.partnum);
            cc.find("Canvas/Diamonds/diamond_label").getComponent(cc.Label).string = money.getlabel(money.diamondnum);
            this.num = 1;
        }else{
            this.num++;
        }
    }
});
