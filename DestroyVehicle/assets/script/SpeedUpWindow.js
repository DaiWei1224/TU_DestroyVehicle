let self=this;
cc.Class({
    extends: cc.Component,

    properties: {
        mask:cc.Node,
        ButtonNode:cc.Node,
        button:cc.Button,
    },

    start () {
        self=this;
        self.button=this.ButtonNode.getComponent(cc.Button);
        if(money.diamondnum<10)
        {
            self.button.interactable =false;
        }
        else self.button.interactable = true ;
        var actionFadeIn = cc.spawn(cc.fadeTo(Popup._animSpeed, 255), cc.scaleTo(Popup._animSpeed, 1));
        this.node.runAction(actionFadeIn);
    },

    DoubleIncome()
    {
        //如果有钻石 扣钻石
        if(money.diamondnum>=10){
            Sound.PlaySound("speed up");
            weapon_info.weapon_earningspeed=2;
            
            var mul2Button=cc.find('Canvas/mul2Button');console.log("nnn"+mul2Button.name);
            mul2Button.getComponent("SpeedUp").DoubleIncomeTime+=60;
            money.diamondnum -= 10;

            cc.find("Canvas/Diamonds/diamond_label").getComponent(cc.Label).string = money.getlabel(money.diamondnum);

            if(money.diamondnum<10)
            self.button.interactable =false;
        }
        else self.button.interactable =false;
        //如果没有钻石
    },

    DestroyItSelf()
    {
        Sound.PlaySound("Buzzer1");
        self.mask.destroy();
        var finished = cc.callFunc(function () {
            self.node.destroy();
        }, this);
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Popup._animSpeed, 0), cc.scaleTo(Popup._animSpeed, 0)), finished);
        self.node.runAction(actionFadeOut);
    },
});
