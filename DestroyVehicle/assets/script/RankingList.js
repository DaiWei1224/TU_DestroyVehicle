cc.Class({
    extends: cc.Component,

    properties: {
        ranking_list: {
            default: null,
            type: cc.Node,
        },
        RankingListNode: {
            default: null,
            type: cc.Node,
        },
        LeftList: {
            default: null,
            type: cc.Node,
            displayName: "左侧栏",
        },
        mask: cc.Node,
        listBtn: cc.Node,
        windowSpeed: 0.2,
    },

    start () {
        this.startRefesh();
    },

    init: function () {
        let openDataContext = wx.getOpenDataContext();
        this.sharedCanvas = openDataContext.canvas;
    },

    startRefesh: function () {
        if (!this.sharedCanvas) {
            this.init();
        }
        this.refreshStart = true;
        // 防止子域响应慢，或者头像加载慢
        // 每隔0.7s 绘制1次 总共绘制6次
        this.refreshTimeRest = 6;
        this.refreshTimer = 0.4
        this.refreshInterval = 0.7;
    },

    update: function (dt) {        
        if (this.refreshStart && this.refreshTimeRest > 0) {
        // 每隔0.7s 绘制1次 总共绘制6次
            this.refreshTimer += dt;
            if (this.refreshTimer > this.refreshInterval) {
                this.refreshTimer -= this.refreshInterval;
                this.refreshTimeRest--;
                this.show();
            }
        }
    },

    show: function () {
        if (this.texture == null) {
            this.texture = new cc.Texture2D();
        }

        if (this.spriteFrame) {
            this.spriteFrame.clearTexture();
        }

        if (this.texture) {
            if (!this.sharedCanvas) {
                this.init()
            }
            this.texture.initWithElement(this.sharedCanvas);
            this.texture.handleLoadedTexture();
            this.spriteFrame = new cc.SpriteFrame(this.texture);
            // 此处已经拿到了spriteFrame，可以随便放在需要的sprite上了
            //this.rankSprite.spriteFrame = this.spriteFrame;
            this.ranking_list.getComponent(cc.Sprite).spriteFrame = this.spriteFrame;
        }
    },

    hide: function () {
        // if (this.spriteFrame) {
        //     this.spriteFrame.clearTexture();
        //     this.spriteFrame = null;
        // }

        // if (this.texture) {
        //     this.texture.destroy();
        // }
        wx.getOpenDataContext().postMessage({
            messageType: "0"
        });
    },

    clickRankingButton: function() {
        var level = cc.find('Canvas/Blood/level').getComponent(cc.Label).string.split('.');
        level = level[1];
        //上传数据到云端
        wx.setUserCloudStorage({
            KVDataList: [{
                key: "levelRank2",
                value: level.toString(),
            }],
            // success: function (res) {
            //     console.log("upload success");
            // },
            // fail: function (res) {
            //     console.log("upload fail");
            // },
        });
        //向子域放松消息
        wx.getOpenDataContext().postMessage({
            messageType: "1",
            MAIN_MENU_NUM: "levelRank2"
            //keyName: "person_total_money",
        });
        this.startRefesh();

        Sound.PlaySound("touch");
        var self = this;
        self.RankingListNode.active = true;
        var actionFadeIn = cc.sequence(cc.spawn(cc.fadeTo(self.windowSpeed, 255), cc.scaleTo(self.windowSpeed, 1)),null);//, cbFadeIn);
        self.RankingListNode.runAction(actionFadeIn);
        self.listBtn.getComponent('LeftListClick').OuterClick = true;
        self.LeftList.runAction(cc.moveBy(0.1,-150,0));    
        self.scheduleOnce(function(){
            self.mask.active = false;
        },0.1);
    },

    clickCloseButton: function() {
        Sound.PlaySound("touch");
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(this.windowSpeed, 0), cc.scaleTo(this.windowSpeed, 2)),null);//, cbFadeOut);
        this.RankingListNode.runAction(actionFadeOut);
        this.hide();
        this.scheduleOnce(function(){
            this.RankingListNode.active = false;
        },0.6);
        
    },

});
