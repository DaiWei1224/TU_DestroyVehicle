cc.Class({
    extends: cc.Component,

    properties: {

        list: cc.Node,

        clicknum:0,

        mask: cc.Node,

    },

    // onLoad () {},

    start () {
        var self=this;

        self.node.on("touchstart",function(){
            if(self.clicknum==0)
            {
                self.list.runAction(cc.moveBy(0.1,200,0));

                self.mask.active = true;

                self.clicknum=1;
            }
            else{
                self.list.runAction(cc.moveBy(0.1,-200,0));    

                self.scheduleOnce(function(){
                    self.mask.active = false;
                },0.1);

                self.clicknum=0;
            }  
        },self)
    },

    // update (dt) {},
});
