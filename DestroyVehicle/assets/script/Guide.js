
let self=this;
cc.Class({
    extends: cc.Component,

    properties: {
        WorkerMask:cc.Node,
        GoldCarMask:cc.Node,
        CarMask:cc.Node,
        GoldMask:cc.Node,
        AutoBuyMask:cc.Node,
        SpawnGoldMask:cc.Node,
        CombineMask:cc.Node,
        CarBloodMask:cc.Node,
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
                if(money.partnum>=50){
                    this.CarMask.active=false;
                    this.GoldCarMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="砸车会使您获取金钱";
                    this.GuideLable.setPosition(75,-375);
                    this.GuideStep++;
                    
                }
                break;
            case 1:
                if(money.partnum>=100){
                    this.GoldCarMask.destroy();
                    this.GoldMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="您的金钱已经足够购买一把武器";
                    this.GuideLable.setPosition(75,-375);
                    this.ClickMask.active=true;
                }
                break;
            case 2:
                var slot0arm=this.CombineManager.ArmArry[0];
                var slot1arm=this.CombineManager.ArmArry[1];
                if(slot1arm==0&&slot0arm==0)
                {
                    this.AutoBuyMask.destroy();
                    this.SpawnGoldMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="您放在武器栏内的武器会为您产出金钱";
                    this.GuideLable.setPosition(0,-275);
                    this.ClickMask.active=true;
                    //this.GuideStep++;
                }
                break;
            case 3:
                    var slot0arm=this.CombineManager.ArmArry[0];
                    var slot1arm=this.CombineManager.ArmArry[1];
                    if(slot1arm==0&&slot0arm==0)
                    {
                        this.SpawnGoldMask.destroy();
                        this.CombineMask.active=true;
                        this.GuideLable.getComponent(cc.Label).string="拖动一个武器至同名武器\n合成更高等级武器";
                        this.GuideLable.setPosition(0,-275);
                        this.GuideStep++;
                    }
                    break;
            case 4:
                var slot0arm=this.CombineManager.ArmArry[0];
                var slot1arm=this.CombineManager.ArmArry[1];
                    if(slot1arm==1||slot0arm==1)
                    {
                        this.CombineMask.destroy();
                        this.CarMask.active=true;
                        this.GuideLable.getComponent(cc.Label).string="新的武器拥有更高的攻击力\n快来试试新武器的威力吧";
                        this.GuideLable.setPosition(0,-50);
                        this.GuideStep++;
                    }
                    break;
            case 5:
                var levelstring=this.DataStorage.level.getComponent(cc.Label).string;
                    var Carlevel=parseInt(levelstring.slice(3));
                    if(Carlevel==2)
                    {
                        this.CarMask.destroy();
                        this.CarBloodMask.active=true;
                        this.GuideLable.getComponent(cc.Label).string="新车拥有更高血量\n需要更多伤害才能将它摧毁";
                        this.ClickMask.active=true;
                        this.GuideLable.setPosition(0,25);
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
        if(this.GuideStep==1)
        {
            this.GoldMask.active=false;
            this.AutoBuyMask.active=true;
            this.GuideLable.getComponent(cc.Label).string="点击购买新武器";
            this.GuideLable.setPosition(75,-375);
            this.GuideStep++;
            this.FirstWeapon.destroy();
            var abc=require("CombineManager");
            abc.InstNewArm(0);
            this.ClickMask.active=false;
        }
        else if(this.GuideStep==2)
        {
            this.ClickMask.active=false;
            this.GuideLable.getComponent(cc.Label).string="即便您离线 也会在离线的前两小时产生收益";
            this.GuideLable.setPosition(75,-375);
            this.GuideStep++;
        }
        else if(this.GuideStep==5)
        {
            this.CarBloodMask.destroy();
            this.WorkerBody.active=true;
            this.WorkerMask.active=true;
            self.node.setContentSize(1200,1800);
            this.GuideLable.getComponent(cc.Label).string="恭喜您解锁了工人";
            this.GuideLable.setPosition(0,25);
            this.GuideStep++;
            this.HitVehicle.count=0;
        }
            if(this.GuideStep==6)
            {
                if(this.WorkerGuideStep==0)
                {
                    this.GuideLable.getComponent(cc.Label).string="工人会使用您的武器为您砸车";
                    this.WorkerGuideStep++;
                }
                else if(this.WorkerGuideStep==1)
                {
                    this.GuideLable.getComponent(cc.Label).string="由于他对武器的使用更加熟练\n其伤害比您点击伤害更高";
                    this.WorkerGuideStep++;
                }
                else if(this.WorkerGuideStep==2)
                {
                    this.GuideLable.getComponent(cc.Label).string="注意：工人只在您上线时工作";
                    this.WorkerGuideStep++;
                }
                else if(this.WorkerGuideStep==3)
                {
                    this.WorkerMask.destroy();
                    this.GuideStep++;
                    this.SlotsMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="武器会自动产生金钱\n即便您已离线";
                    this.GuideLable.setPosition(0,100);
                }
            }
            else if(this.GuideStep==7)
            {
                this.ExitGuide();
            } 
    },

});
