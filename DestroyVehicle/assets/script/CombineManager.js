// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
let self=this;
cc.Class({
    extends: cc.Component,

    properties: {
        MouseDownPos:cc.Vec2,
        MouseUpPos:cc.Vec2,
        MouseDownSlot:0,
        MouseUpSlot:0,
        FollowArm:cc.Node,//？？？

        MyArmNode:cc.Node,//？？？
        WorkerArmNode:cc.Node,//？？？

        ArmArry:[cc.Integer],//？？
        ArmPrefabArry:[cc.Prefab],
        SlotPositionArry:[cc.Vec2],

        SlotRangeXArry:[cc.Vec2],
        SlotRangeYArry:[cc.Vec2],
        DustbinRange:[cc.Vec2],//
        
        ArmImagesArry:[cc.Node],
        ArmSpritFrameArry:[cc.SpriteFrame],

        CurrentArmRank:0,
        MaxArmRank:0,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad(){
        self=this;
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            console.log("触摸了");
            self.MouseDownSlot=self.GetSlot(event.getLocation());//得到触摸的是第几块
            console.log(parseInt(self.MouseDownPos));
            self.MouseDownOnSlot(self.MouseDownSlot,event.getLocation());//触摸的位置（x，y），和第几个
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if(self.FollowArm)
            {
                self.FollowArm.setPosition(self.node.convertToNodeSpaceAR(event.getLocation()));
            }
        }, this.node);
        this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            
            self.MouseUpSlot=self.GetSlot(event.getLocation());
            self.MouseUpOnSlot(self.MouseUpSlot);
        }, this.node);
    },


    start () {
        this.ChangeSprites();
    },

    update (dt) {

    },


    GetSlot(Pos)
    {
        var slotx=-1,sloty=-1;
        if(Pos.x>=self.SlotRangeXArry[0].x&&Pos.x<=self.SlotRangeXArry[0].y)
        slotx=0;
        else if(Pos.x>=self.SlotRangeXArry[1].x&&Pos.x<=self.SlotRangeXArry[1].y)
        slotx=1;
        else if(Pos.x>=self.SlotRangeXArry[2].x&&Pos.x<=self.SlotRangeXArry[2].y)
        slotx=2;
        else if(Pos.x>=self.SlotRangeXArry[3].x&&Pos.x<=self.SlotRangeXArry[3].y)
        slotx=3;

        if(Pos.y>=self.SlotRangeYArry[0].x&&Pos.y<=self.SlotRangeYArry[0].y)
        sloty=0;
        else if(Pos.y>=self.SlotRangeYArry[1].x&&Pos.y<=self.SlotRangeYArry[1].y)
        sloty=1;
        else if(Pos.y>=self.SlotRangeYArry[2].x&&Pos.y<=self.SlotRangeYArry[2].y)
        sloty=2;


        if(slotx==-1||sloty==-1)
        {
            if(Pos.x>=self.DustbinRange[0].x&&Pos.x<=self.DustbinRange[0].y&&
                Pos.y>=self.DustbinRange[1].x&&Pos.y<=self.DustbinRange[1].y)
                {
                    return -2;
                }
            else    return -1;
        }

        else return sloty*4+slotx;
    },


    MouseDownOnSlot(slotnum,position)
    {
        if(self.ArmArry[slotnum]>-1){
            self.SpawnFollowArm(self.ArmArry[slotnum],position);
            self.ArmImagesArry[slotnum].opacity = 100;
        }
    },

    SpawnFollowArm(Armnum,position){
        var FArm = cc.instantiate(self.ArmPrefabArry[Armnum]);
        self.node.addChild(FArm);
        FArm.setPosition(position);
        self.FollowArm=FArm;
    },

    MouseUpOnSlot(slotnum)
    {
        if(self.MouseDownSlot==-1) return;
        if(slotnum==-2)
        {
            self.ArmDelet(self.MouseDownSlot);
            console.log("delet");
        }
        else if(slotnum==-1)
        {
            self.ArmMoveCancle(self.MouseDownSlot);console.log("cancle");
        }
        else if(self.ArmArry[slotnum]==self.ArmArry[self.MouseDownSlot]&&self.ArmArry[slotnum]!=-1)
        {
            self.ArmCombine(self.MouseDownSlot,slotnum);console.log("combine");
        }
        else if(self.ArmArry[self.MouseDownSlot]>-1&&self.ArmArry[slotnum]==-1)
        {
            self.ArmMove(self.MouseDownSlot,slotnum);console.log("move");
        }
        else if(self.ArmArry[self.MouseDownSlot]!=self.ArmArry[slotnum])
        {
            self.ArmChangePlace(self.MouseDownSlot,slotnum);console.log("changeplace");
        }
    },

    ArmCombine(downslot,upslot)
    {
        self.ArmImagesArry[downslot].destroy();

        var finished = cc.callFunc(function () {
            self.FollowArm.destroy();
            self.ArmArry[downslot]=-1;
            self.ArmArry[upslot]+=1;

            self.ArmImagesArry[upslot].destroy();
            var Armi = cc.instantiate(self.ArmPrefabArry[self.ArmArry[upslot]]);
            self.node.addChild(Armi);
            self.ArmImagesArry[upslot]=Armi;
            Armi.setPosition(self.SlotPositionArry[upslot]);

            if(self.ArmArry[upslot]>self.MaxArmRank)
            {
                self.MaxArmRank=self.ArmArry[upslot];
                self.GetBetterArm(self.MaxArmRank);
            }

        }, this);

        var CollisionEffectA=cc.sequence(cc.moveBy(0.1,100,0),cc.moveBy(0.1,-50,0),finished);
        var CollisionEffectB=cc.sequence(cc.moveBy(0.1,-100,0),cc.moveBy(0.1,50,0));

        var CollisionEffect=cc.callFunc(function () {
            self.FollowArm.runAction(CollisionEffectA);
            self.ArmImagesArry[upslot].runAction(CollisionEffectB);
        }, this);

        var action = cc.sequence(cc.moveTo(0.2, self.SlotPositionArry[upslot]),CollisionEffect);
        self.FollowArm.runAction(action);
    },

    ArmMove(downslot,upslot)
    {
        if(self.ArmArry[downslot]>-1&&self.ArmArry[upslot]==-1)
        {
            self.ArmArry[upslot]=self.ArmArry[downslot];
            self.ArmArry[downslot]=-1;
        }
        self.ChangeSprites();
    },

    ArmChangePlace(downslot,upslot)
    {
        var temp=self.ArmArry[downslot];
        self.ArmArry[downslot]=self.ArmArry[upslot];
        self.ArmArry[upslot]=temp;
        self.ChangeSprites();
    },

    ArmMoveCancle(downslot)
    {
        self.FollowArm.destroy();
        self.ArmImagesArry[downslot].opacity = 255;
    },

    ArmDelet(downslot)
    {
        self.FollowArm.destroy();
        self.ArmImagesArry[downslot].destroy();
        
        var part=cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
       
        part.string=parseInt(part.string)+Math.floor(0.8*parseInt(weapon_info.getPrice(self.ArmArry[downslot],0)));
       self.ArmArry[downslot]=-1;
    },

    ChangeSprites()
    {
        var children = self.node.children;
        for (var i = 0; i < children.length; ++i) {
            children[i].destroy();
        }
        for(var value=0;value<12;value++)
        {
            if(self.ArmArry[value]>-1)
            {
                var Armi = cc.instantiate(self.ArmPrefabArry[self.ArmArry[value]]);
                self.node.addChild(Armi);
                self.ArmImagesArry[value]=Armi;
                Armi.setPosition(self.SlotPositionArry[value]);
            }
        }
    },

    GetBetterArm(ArmRank)
    {
        self.ChangeArm(ArmRank);
    },

    ChangeArm(ArmRank)
    {
        self.MyArmNode.getComponent(cc.Sprite).spriteFrame = self.ArmSpritFrameArry[ArmRank];
        //self.WorkerArmNode.getComponent(cc.Sprite).spriteFrame = self.ArmSpritFrameArry[ArmRank];
        var car=cc.find("Canvas/Vehicle").getComponent("HitVehicle");//改变等级
        car.power=weapon_info.getatk(ArmRank);
    },

     
});

    module.exports.InstNewArm=function(ArmRank)
    {
        
        for(var i=0;i<12;i++)
        {
            if(self.ArmArry[i]==-1)
            {
                self.ArmArry[i]=ArmRank;
                var Armi = cc.instantiate(self.ArmPrefabArry[self.ArmArry[i]]);
                self.node.addChild(Armi);
                self.ArmImagesArry[i]=Armi;
                Armi.setPosition(self.SlotPositionArry[i]);
                //此处扣除金币/钻石
                break;
            }
            if(i==11&&self.ArmArry[i]>-1)
            {
                //没有空间 购买失败
            }
        }
        console.log("创建编号为"+ArmRank+"的武器");
    };
