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
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    
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
        this.Time=300;
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
                    this.TimeNode.getComponent(cc.Label).string="00:00";
                    this.node.getComponent(cc.Sprite).spriteFrame=this.OpenImage;
                    this.ContentNum=Math.ceil(weapon_info.level_now*2);
                    this.NumberBG.active=true;
                    this.NumberLabel.getComponent(cc.Label).string=this.ContentNum;
                }
            }
        },1);
    },

    OpenBox()
    {
        if(this.CanOpen==true)
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
                    this.Time=300;
                }
            }
            /*else
            {
                Sound.PlaySound("Buzzer1");
            }*/
        }
    },

    // update (dt) {},

    InstRandWeapon()
    {
        //console.log("aaa"+this.RankToArmRank[20]);
        if(weapon_info.level_now<=1)
        return 0;
        var rand=Math.random();
        if(rand<=0.05){
            //console.log(this.RankToArmRank[1]);
            return this.RankToArmRank[parseInt(weapon_info.level_now*3)];
            
        }

        else   if(rand<=0.2)
        {
            //console.log(this.RankToArmRank[10]);
        return this.RankToArmRank[parseInt(weapon_info.level_now*3)+1];
        }
        else 
        {
            //console.log(this.RankToArmRank[19]);
            return this.RankToArmRank[parseInt(weapon_info.level_now*3)+2];
        }
    },
});
