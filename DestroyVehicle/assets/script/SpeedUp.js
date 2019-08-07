
cc.Class({
    extends: cc.Component,

    properties: {

        DoubleIncomeTime:0,
        SpeedUpTime:cc.Node,
        SpeedUpWindow:cc.Prefab,
    },

    // LIFE-CYCLE CALLBACKS:


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
});
