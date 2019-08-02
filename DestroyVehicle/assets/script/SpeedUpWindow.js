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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        mask:cc.Node,
        ButtunMask:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        self=this;
        if(money.diamondnum<10)
        {
            self.ButtunMask.active=true;
        }
        else self.ButtunMask.active=false;
        console.log("SUW");
        var actionFadeIn = cc.spawn(cc.fadeTo(Popup._animSpeed, 255), cc.scaleTo(Popup._animSpeed, 1));
        this.node.runAction(actionFadeIn);
    },

    DoubleIncome()
    {
        //如果有钻石 扣钻石
        if(money.diamondnum>=10){
            //Sound.PlaySound("speed up");
            weapon_info.weapon_earningspeed=2;
            
            var mul2Button=cc.find('Canvas/mul2Button');console.log("nnn"+mul2Button.name);
            mul2Button.getComponent("SpeedUp").DoubleIncomeTime+=60;
            //mul2Button.getComponent("SpeedUp").AddDoubleIncomeTime(60);
            money.diamondnum-=10;
            if(money.diamondnum<10)
                self.ButtunMask.active=true;
        }
        else self.ButtunMask.active=true;
        //如果没有钻石
    },

    DestroyItSelf()
    {
        self.mask.destroy();
        var finished = cc.callFunc(function () {
            self.node.destroy();
        }, this);
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Popup._animSpeed, 0), cc.scaleTo(Popup._animSpeed, 0)), finished);
        self.node.runAction(actionFadeOut);
    },
    // update (dt) {},
});
