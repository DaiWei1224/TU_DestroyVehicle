// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
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

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.x=0;
        this.node.y=0;
        self=this;
        self.node.setScale(2);
    },

    start () {
        console.log(self.level+"!"+this.node.x);
        //this.node.setPosition((360,640));
        self.NewArmImageNode.getComponent(cc.Sprite).spriteFrame = self.ArmImages[self.level];
        self.NewArmName.getComponent(cc.Label).string=" Lv."+(self.level+1)+" "+self.ArmNameArry[self.level]
        self.NewArmAttack.getComponent(cc.Label).string="攻击力 "+Math.floor(5*Math.pow(1.8,self.level))+"k";
        self.NewArmDio.getComponent(cc.Label).string=" +"+(14+6*self.level);

        var actionFadeIn = cc.spawn(cc.fadeTo(Store._animSpeed, 255), cc.scaleTo(Store._animSpeed, 1));
        self.node.runAction(actionFadeIn);
    },

    DestroyItSelf()
    {
        self.NewArmImageNode.getComponent(cc.Sprite).spriteFrame = null;
        //加钻石 14+6*self.level
        var finished = cc.callFunc(function () {
            self.node.destroy();
        }, this);
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Store._animSpeed, 0), cc.scaleTo(Store._animSpeed, 0)), finished);
        self.node.runAction(actionFadeOut);
        //this.node.destroy();
    },

    DestroyItSelf_double()
    {
        self.NewArmImageNode.getComponent(cc.Sprite).spriteFrame = null;
        //加双倍钻石 28+12*self.level
        var finished = cc.callFunc(function () {
            self.node.destroy();
        }, this);
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Store._animSpeed, 0), cc.scaleTo(Store._animSpeed, 0)), finished);
        self.node.runAction(actionFadeOut);
        //this.node.destroy();
    },

    SetArmLevel(armlevel)
    {
        self.level=armlevel;
    },
    // update (dt) {},
});
