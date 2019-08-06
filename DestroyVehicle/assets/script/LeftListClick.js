var IsListOut = false;

cc.Class({
    extends: cc.Component,

    properties: {
        list: cc.Node,
        mask: cc.Node,

        OuterClick: {
            default: false, //点击其他按钮左侧栏自动收回的判断标志
        },
    },

    // onLoad () {},

    start () {
        var self=this;

        self.node.on("touchstart",function(){
            if(self.OuterClick || !IsListOut)
            {
                self.OuterClick = false;

                self.list.runAction(cc.moveBy(0.1,200,0));

                self.mask.active = true;

                IsListOut = true;
                
                Sound.PlaySound("touch");
            }
            else
            {
                self.list.runAction(cc.moveBy(0.1,-200,0));    

                self.scheduleOnce(function(){
                    self.mask.active = false;
                },0.1);

                IsListOut = false;
                
                Sound.PlaySound("touch");
            }
        },self)
    },

    shareButtonClick()
    {
        Sound.PlaySound("touch");
        cc.loader.loadRes("share", function (err, data) {
            wx.shareAppMessage({
                title: "智商不足？快来充值！",
                imageUrl: data.url,
                success(res) {
                    console.log(res)
                },
                fail(res) {
                    console.log(res)
                }
            })
        });
        console.log("分享");
    },

    // update (dt) {
    //     console.log(this.OuterClick);
    // },
});
