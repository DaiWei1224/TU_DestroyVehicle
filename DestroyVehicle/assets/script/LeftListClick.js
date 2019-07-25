var IsListOut = false;

cc.Class({
    extends: cc.Component,

    properties: {
        list: cc.Node,
        mask: cc.Node,
    },

    // onLoad () {},

    start () {
        var self=this;

        self.node.on("touchstart",function(){
            if(IsListOut)
            {
                

                self.list.runAction(cc.moveBy(0.1,-200,0));    

                self.scheduleOnce(function(){
                    self.mask.active = false;
                },0.1);

                IsListOut = false;
            }
            else{
                self.list.runAction(cc.moveBy(0.1,200,0));

                self.mask.active = true;

                IsListOut = true;
            }  
        },self)
    },

    // update (dt) {},
});
