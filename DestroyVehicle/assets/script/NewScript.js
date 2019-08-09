let self=this;
cc.Class({
    extends: cc.Component,
    properties: {
        parent:cc.Node,
        level:0,

        NewArmImageNode:cc.Node,
        NewArmName:cc.Node,
        NewArmAttack:cc.Node,
        NewArmDio:cc.Node,

        ArmNameArry:[cc.String],
        ArmImages:[cc.SpriteFrame],
        
    },

    onLoad () {
        this.node.x=0;
        this.node.y=0;
        self=this;
        self.node.setScale(2);
    },

    start () {
        self.NewArmImageNode.getComponent(cc.Sprite).spriteFrame = self.ArmImages[self.level];
        self.NewArmName.getComponent(cc.Label).string=" Lv."+(self.level+1)+" "+self.ArmNameArry[self.level]
        self.NewArmAttack.getComponent(cc.Label).string="攻击力 "+weapon_info.getattack(self.level);
        self.NewArmDio.getComponent(cc.Label).string="x " + money.getlabel(14+6*self.level);

        var actionFadeIn = cc.spawn(cc.fadeTo(Popup._animSpeed, 255), cc.scaleTo(Popup._animSpeed, 1));
        self.node.runAction(actionFadeIn);
        Sound.PlaySound("new weapon");
    },

    DestroyItSelf()
    {
        Sound.PlaySound("diamond");
        self.NewArmImageNode.getComponent(cc.Sprite).spriteFrame = null;
        money.diamondnum=parseInt(money.diamondnum)+14+6*self.level;
        cc.find("Canvas/Diamonds/diamond_label").getComponent(cc.Label).string=money.getlabel(money.diamondnum);
        var finished = cc.callFunc(function () {
            self.node.destroy();
        }, this);
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Popup._animSpeed, 0), cc.scaleTo(Popup._animSpeed, 0)), finished);
        self.node.runAction(actionFadeOut);
    },

    SetArmLevel(armlevel)
    {
        self.level=armlevel;
    },
});
