var count = 0;

cc.Class({
    extends: cc.Component,

    properties: {
        //  血条
        blood: {
            default: null,
            type: cc.ProgressBar
        },
        //金币
        coin: {
            default: null,
            type: cc.Label
        },

        power: {
            default: 1,
            type: cc.Float,
            displayName: "工人攻击力",
        },

        bloodValue: {
            default: 100,
            type: cc.Float,
            displayName: "血量值",
        }
    },

    onLoad () {
        var self = this;

    },

    //playAnimation: function(anim){
        // while(true){
        //     self.scheduleOnce(function(){
        //         //需要延时操作的内容            
        //         anim.play();
        //     },1);   
        // }      
    //},

    start () {

    },

    update (dt) {
        count++;

        if(count % 60 == 0){   //一秒60帧，120表示工人2秒砸一次
            var anim = this.getComponent(cc.Animation);
            anim.play();
            
            var decBlood = this.power / this.bloodValue;
            //console.log(decBlood);  

            this.blood.progress -= decBlood;    //扣除耐久度
            var a = parseInt(this.coin.string); //将金币label的string内容转化为int
            a += 5;
            this.coin.string = a;
        }

    },
});
