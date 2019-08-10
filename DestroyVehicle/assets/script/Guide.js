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
        WorkerMask:cc.Node,
        CarMask:cc.Node,
        AutoBuyMask:cc.Node,
        CombineMask:cc.Node,
        SlotsMask:cc.Node,

        GuideLable:cc.Node,

        CombineManager:null,//combinemanager script
        DataStorage:null,

        GuideStep:Number,
        WorkerGuideStep:Number,

        HitVehicle:null,
        WorkerBody:cc.Node,
        FirstWeapon:cc.Node,
        ClickMask:cc.Node,
    },

    onLoad () {
        // self=this;
        // this.HitVehicle=cc.find("Canvas/Vehicle").getComponent("HitVehicle");
        // this.WorkerBody=cc.find("Canvas/zache");
        // this.WorkerBody.active=false;
        // this.ClickMask.active=false;
    },
    StopWorker(){
        if(this.HitVehicle.count>=-5000&&this.GuideStep<4000){
            this.HitVehicle.count=-6000;
        }
        else this.unschedule(StopWorker);
    },
    start () {
        self=this;
        this.HitVehicle=cc.find("Canvas/Vehicle").getComponent("HitVehicle");
        this.WorkerBody=cc.find("Canvas/zache");
        this.WorkerBody.active=false;
        this.ClickMask.active=false;

        this.CombineManager=cc.find("Canvas/SlotManager").getComponent("CombineManager");
        this.DataStorage=cc.find("Canvas").getComponent("DataStorage");
        this.GuideStep=0;
        this.WorkerGuideStep=0;
        this.CarMask.active=true;

        this.HitVehicle.count=-100000;
        this.schedule(this.StopWorker,800);
        this.GuideLable.getComponent(cc.Label).string="点击车辆砸车";
    },

    

    update (dt) {
        this.GuideUpdate();
    },

    GuideUpdate()
    {
        switch(this.GuideStep)
        {
            case 0:
                if(money.partnum>=100){
                    this.CarMask.active=false;
                    this.AutoBuyMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="点击购买新武器";
                    this.GuideLable.setPosition(75,-375);
                    this.GuideStep++;
                    this.FirstWeapon.destroy();
                    var abc=require("CombineManager");
                    abc.InstNewArm(0);
                }
                break;
            case 1:
                    var slot0arm=this.CombineManager.ArmArry[0];
                    var slot1arm=this.CombineManager.ArmArry[1];
                    if(slot1arm==0&&slot0arm==0)
                    {
                        this.AutoBuyMask.destroy();
                        this.CombineMask.active=true;
                        this.GuideLable.getComponent(cc.Label).string="拖动一个武器至同名武器\n合成更高等级武器";
                        this.GuideLable.setPosition(0,-275);
                        this.GuideStep++;
                    }
                    break;
            case 2:
                var slot0arm=this.CombineManager.ArmArry[0];
                var slot1arm=this.CombineManager.ArmArry[1];
                    if(slot1arm==1||slot0arm==1)
                    {
                        this.CombineMask.destroy();
                        this.CarMask.active=true;
                        this.GuideLable.getComponent(cc.Label).string="快来试试新武器的威力吧";
                        this.GuideLable.setPosition(0,-50);
                        this.GuideStep++;
                    }
                    break;
            case 3:
                var levelstring=this.DataStorage.level.getComponent(cc.Label).string;
                    var Carlevel=parseInt(levelstring.slice(3));
                    if(Carlevel==2)
                    {
                        this.CarMask.destroy();
                        this.WorkerBody.active=true;
                        this.WorkerMask.active=true;
                        self.node.setContentSize(1200,1800);
                        this.GuideLable.getComponent(cc.Label).string="恭喜您解锁了工人";
                        this.ClickMask.active=true;
                        this.GuideLable.setPosition(0,25);
                        this.GuideStep++;
                        this.HitVehicle.count=0;
                    }
                    break;
        }
    },

    ExitGuide()
    {
        this.node.destroy();
    },

    TouchDown()
    {
            if(this.GuideStep==4)
            {
                if(this.WorkerGuideStep==0)
                {
                    this.GuideLable.getComponent(cc.Label).string="工人会使用您的武器为您砸车";
                    this.WorkerGuideStep++;
                }
                else if(this.WorkerGuideStep==1)
                {
                    this.GuideLable.getComponent(cc.Label).string="但工人会在您离线时休息";
                    this.WorkerGuideStep++;
                }
                else if(this.WorkerGuideStep==2)
                {
                    this.WorkerMask.destroy();
                    this.GuideStep++;
                    this.SlotsMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="武器会自动产生金钱\n即便您已离线";
                    this.GuideLable.setPosition(0,100);
                }
            }
            else if(this.GuideStep==5)
            {
                this.ExitGuide();
            } 
    },

});
