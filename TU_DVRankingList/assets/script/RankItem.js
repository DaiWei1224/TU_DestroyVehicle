cc.Class({
    extends: cc.Component,
    //name: "RankItem",
    properties: {
        numberBG: cc.Sprite,
        numberLabel: cc.Label,
        //avatarImageLayout: cc.Sprite,
        avatarImage: cc.Sprite,
        nickNameLabel: cc.Label,
        scoreLabel: cc.Label,
    },

    init: function (rank, data, IsSelf) {
        var self = this;
        let avatarUrl = data.avatarUrl;
        // let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
        let nick = data.nickname;
        let grade = data.KVDataList.length != 0 ? data.KVDataList[0].value : 0;
        //设置好友的编号颜色和数字
        if (rank < 5) {
            self.loadImage("rank/number" + (rank + 1), self.numberBG);
            self.numberLabel.string = (rank + 1);  
        } 
        //设置底部自己那一项的编号颜色和数字
        if(IsSelf){
            if(rank < 3){
                self.loadImage("rank/number" + (rank + 1), cc.find("Canvas/Low/numberBG").getComponent(cc.Sprite));
            }else{
                self.loadImage("rank/number4", cc.find("Canvas/Low/numberBG").getComponent(cc.Sprite));
            }
            cc.find("Canvas/Low/numberLabel").getComponent(cc.Label).string = (rank + 1);
            this.loadImage("rank/self", cc.find("Canvas/Low/avatarImageLayout").getComponent(cc.Sprite));
            this.createImage(avatarUrl, true);
            cc.find("Canvas/Low/nickNameLabel").getComponent(cc.Label).string = nick;
            cc.find("Canvas/Low/scoreLabel").getComponent(cc.Label).string = 'Lv.' + grade;
        }
        this.createImage(avatarUrl, false);
        this.nickNameLabel.string = nick;
        this.scoreLabel.string = 'Lv.' + grade;
    },
    createImage(avatarUrl, IsSelf) {
        if (CC_WECHATGAME) {
            try {
                let image = wx.createImage();
                image.onload = () => {
                    try {
                        let texture = new cc.Texture2D();
                        texture.initWithElement(image);
                        texture.handleLoadedTexture();
                        this.avatarImage.spriteFrame = new cc.SpriteFrame(texture);
                        if(IsSelf){
                            cc.find("Canvas/Low/avatarImage").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                        }
                    } catch (e) {
                        cc.log(e);
                        this.avatarImage.node.active = false;
                    }
                };
                image.src = avatarUrl;
            }catch (e) {
                cc.log(e);
                this.avatarImage.node.active = false;
            }
        } else {
            cc.loader.load({
                url: avatarUrl, type: 'jpg'
            }, (err, texture) => {
                this.avatarImage.spriteFrame = new cc.SpriteFrame(texture);
                if(IsSelf){
                    cc.find("Canvas/Low/avatarImage").getComponent(cc.Sprite).spriteFrame = new cc.SpriteFrame(texture);
                }
            });
        }
    },

    loadImage: function(routeName, self){
        cc.loader.loadRes(routeName, cc.SpriteFrame, function (err, texture) {
            if(err){
                console.log(err);
            }                   
            //self.node.getComponent(cc.Sprite).spriteFrame = texture;
            self.spriteFrame = texture;
        });
    },

});
