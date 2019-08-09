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
        Time:Number,
        TimeNode:cc.Node,
        CanOpen:Boolean,
        ContentNum:Number,
        NumberBG:cc.Node,
        NumberLabel:cc.Node,
        CloseImage:cc.SpriteFrame,
        OpenImage:cc.SpriteFrame,

        RankToArmRank:[Number],

        GiftWindow:cc.Node,
        WindowConfirmed:Boolean,
    },
    
    start () {
        this.RankToArmRank=new Array(0,0,0
            ,0,0,0,
            0,0,1,
            1,1,2,
            1,2,2,
            1,2,3,
            2,2,3,
            2,3,3,
            3,3,4,
            3,4,4,
            4,4,4,
            4,4,5,
            4,5,5,
            5,5,5,
            5,6,6,
            6,6,7,
            6,7,8,
            7,8,8,
            8,9,9,
            9,10,11,
            10,11,12,
            11,12,12,
            11,12,13,
            12,13,14,
            13,13,14,
            13,14,14,
            14,14,15,
            14,15,15,
            15,16,17,
            16,17,17);
        this.CanOpen=false;
        this.WindowConfirmed=false;
        this.Time=180;
        this.schedule(function(){
            
            if(this.Time>0){
                this.Time-=1;
                var min=Math.floor(this.Time/60);
                var sec=this.Time-min*60;
                if(sec>9)
                    this.TimeNode.getComponent(cc.Label).string=min+":"+sec;
                else
                    this.TimeNode.getComponent(cc.Label).string=min+":0"+sec;
                if(this.Time==0){
                    this.CanOpen=true;
                    this.TimeNode.getComponent(cc.Label).string=" ";
                    this.node.getComponent(cc.Sprite).spriteFrame=this.OpenImage;
                    if(weapon_info.level_now<=10)
                        this.ContentNum=6;
                    else{
                        this.ContentNum=Math.ceil(weapon_info.level_now/2)+1;}
                    this.NumberBG.active=true;
                    this.NumberLabel.getComponent(cc.Label).string=this.ContentNum;
                    var ShakeEffact=cc.repeatForever(cc.sequence(cc.rotateTo(0.05,20),cc.rotateTo(0.1,-20),cc.rotateTo(0.1,20),cc.rotateTo(0.05,0),cc.delayTime(1)));
                    this.node.runAction(ShakeEffact);
                }
            }
        },1);
        
    },

    OpenBox()
    {
        if(this.CanOpen==true)
        {
            if(this.WindowConfirmed==true)
            {
            var combineM= require("CombineManager");
            var armtype=parseInt(this.InstRandWeapon());

            console.log(weapon_info.level_now+"type"+armtype);
            var flag=combineM.InstNewArm(armtype);
            if(flag== "1")
            {
                Sound.PlaySound("buy");
                this.ContentNum-=1;
                this.NumberLabel.getComponent(cc.Label).string=this.ContentNum;
                if(this.ContentNum==0)
                {
                    this.node.getComponent(cc.Sprite).spriteFrame=this.CloseImage;
                    this.NumberBG.active=false;
                    this.CanOpen=false;
                    this.Time=180;
                    this.node.stopAllActions();
                    this.node.runAction(cc.rotateTo(0.05,0));
                    this.WindowConfirmed=false;
                }
            }
            }
            else
            {
                this.GiftWindow.active=true;
                var actionFadeIn = cc.spawn(cc.fadeTo(Popup._animSpeed, 255), cc.scaleTo(Popup._animSpeed, 1));
                this.GiftWindow.runAction(actionFadeIn);
            }
        }
    },


    InstRandWeapon()
    {
        if(weapon_info.level_now<=1)
        return 0;
        var rand=Math.random();
        if(rand<=0.05){
            return this.RankToArmRank[parseInt(weapon_info.level_now*3)];
            
        }

        else   if(rand<=0.2)
        {
        return this.RankToArmRank[parseInt(weapon_info.level_now*3)+1];
        }
        else 
        {
            return this.RankToArmRank[parseInt(weapon_info.level_now*3)+2];
        }
    },

    CloseGiftWindow()
    {
        var finished = cc.callFunc(function () {
            this.GiftWindow.active=false;
        }, this);
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Popup._animSpeed, 0), cc.scaleTo(Popup._animSpeed, 2)), finished);
        this.GiftWindow.runAction(actionFadeOut);
        Sound.PlaySound("Buzzer1");
    },

    ConfirmGiftWindow()
    {
        var finished = cc.callFunc(function () {
            this.GiftWindow.active=false;
            this.WindowConfirmed=true;
        }, this);
        var actionFadeOut = cc.sequence(cc.spawn(cc.fadeTo(Popup._animSpeed, 0), cc.scaleTo(Popup._animSpeed, 2)), finished);
        this.GiftWindow.runAction(actionFadeOut);
        Sound.PlaySound("touch");
    }
});
