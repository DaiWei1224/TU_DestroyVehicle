// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
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

        DoubleIncomeTime:0,
        SpeedUpTime:cc.Node,
        SpeedUpWindow:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start() {
        this.SpeedUpTime.getComponent(cc.Label).string="双倍金币";
        this.schedule(function(){
            if(this.DoubleIncomeTime>0){
                var min=Math.floor(this.DoubleIncomeTime/60);
                var sec=this.DoubleIncomeTime-min*60;
                if(sec>9)
                    this.SpeedUpTime.getComponent(cc.Label).string=min+":"+sec;
                else
                    this.SpeedUpTime.getComponent(cc.Label).string=min+":0"+sec;
                this.DoubleIncomeTime-=1;
                if(this.DoubleIncomeTime==0){
                    weapon_info.weapon_earningspeed=1;
                    this.SpeedUpTime.getComponent(cc.Label).string="双倍金币";
                }
            }
            },1);
    },

    PopWindow()
    {
        Sound.PlaySound("touch");
        var window = cc.instantiate(this.SpeedUpWindow);
        this.node.parent.addChild(window);
        
        window.setPosition(0,0);console.log("position"+window.position);
    },

    /*AddDoubleIncomeTime(num)
    {
        this.DoubleIncomeTime+=num;
    }*/
});
