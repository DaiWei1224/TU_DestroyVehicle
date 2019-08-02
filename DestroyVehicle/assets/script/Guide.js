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
        WorkerArm:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad () {
        self=this;
        this.HitVehicle=cc.find("Canvas/Vehicle").getComponent("HitVehicle");
        this.WorkerArm=cc.find("Canvas/WorkerHit");
        this.WorkerBody=cc.find("Canvas/WorkerBody");
        this.WorkerArm.active=false;
        this.WorkerBody.active=false;
    },
    StopWorker(){
        if(this.HitVehicle.count>=-5000&&this.GuideStep<4000){
            this.HitVehicle.count=-6000;
        }
        else this.unschedule(StopWorker);
    },
    start () {
        this.CombineManager=cc.find("Canvas/SlotManager").getComponent("CombineManager");
        this.DataStorage=cc.find("Canvas").getComponent("DataStorage");
        this.GuideStep=0;
        this.WorkerGuideStep=0;
        this.CarMask.active=true;

        this.HitVehicle.count=-8000;
        console.log(this.HitVehicle.count);
        /*this.StopWorker=function(){
            var HitVehicle=cc.find("Canvas/HitVehicle").getComponent("HitVehicle");
            if(count>=-500&&this.GuideStep<4){
                HitVehicle.count=-600;
            }
            else this.unschedule(StopWorker);
        }*/
        this.schedule(this.StopWorker,800);
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
                    this.GuideStep++;
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
                        this.GuideStep++;
                    }
                    break;
            case 3:
                var levelstring=this.DataStorage.level.getComponent(cc.Label).string;
                    var Carlevel=parseInt(levelstring.slice(3));
                    //console.log(levelstring+" level "+Carlevel);
                    if(Carlevel==2)
                    {
                        this.CarMask.destroy();
                        this.WorkerArm.active=true;
                        this.WorkerBody.active=true;
                        this.WorkerMask.active=true;
                        self.node.setContentSize(1200,1800);
                        this.GuideLable.getComponent(cc.Label).string="恭喜您解锁了工人";
                        this.GuideStep++;
                        //var HitVehicle=cc.find("Canvas/Vehicle").getComponent("HitVehicle");
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
        console.log("dianji");
            if(this.GuideStep==4)
            {
                console.log(this.WorkerGuideStep+"WorkerGuideStep"+this.GuideLable.name)
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
                    /*if(this.CombineManager.ArmArry[0]==1)
                        this.CombineManager.selfSchedule(0);
                    else this.CombineManager.selfSchedule(1);*/
                    this.GuideLable.getComponent(cc.Label).string="武器会自动产生金钱即便您已离线";
                }
            }
            else if(this.GuideStep==5)
            {
                this.ExitGuide();
            } 
    },

});
