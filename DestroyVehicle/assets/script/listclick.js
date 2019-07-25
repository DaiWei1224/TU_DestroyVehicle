cc.Class({
    extends: cc.Component,

    properties: {

        list: cc.Node,

        clicknum:0,

    },

    // onLoad () {},

    start () {
        var self=this;
        self.node.on("touchstart",function(){
        if(self.clicknum==0)
        {
            self.list.runAction(cc.moveBy(0.1,400,0));
            //self.node.runAction(cc.moveBy(0.1,100,0));
            self.clicknum=1;
        }
        else{
            self.list.runAction(cc.moveBy(0.1,-200,0));
            //self.node.runAction(cc.moveBy(0.1,-100,0));
            self.clicknum=0;
        }
            
        },self)
    },

    // update (dt) {},
});
