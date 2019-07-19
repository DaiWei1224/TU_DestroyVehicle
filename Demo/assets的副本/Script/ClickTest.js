cc.Class({
    extends: cc.Component,

    properties: {
        //  血条
        blood: {
            default: null,
            type: cc.ProgressBar
        },
        //锤子
        hammer: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        
     },

    start () {
        var date;

        var self = this;
        
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            
            var pos = event.getLocation();
            pos=self.node.convertToNodeSpaceAR(pos);
            console.log(pos.x, pos.y);


            date = new Date();

            //self.hammer.position = pos;
            self.hammer.x = pos.x + 70;
            self.hammer.y = pos.y + 70;   

            //let act = cc.sequence(cc.moveBy(1,-5,-5),cc.moveBy(1,5,5));
            //self.hammer.runAction(act);
            
        //     self.scheduleOnce(function(){
        //         //this.addBarriers();   //需要延时操作的内容
        //         self.hammer.x = 800;
        //         self.hammer.y = 400;   
         
        //    },0.5);

            //self.hammer.x = 800;
            //self.hammer.y = 400;                

            console.log("time = " + date.getMilliseconds());

            //震动效果
            let act = cc.sequence(cc.moveBy(0.1,5,5),cc.moveBy(0.1,-5,-5));
            self.node.runAction(act);

            if(date.getMilliseconds() % 10 == 0){
                self.blood.progress -= 0.1;     //暴击
            }
            else{
                self.blood.progress -= 0.01;
            }      

        });
        
    },

    update (dt) {       
        
    },
});
