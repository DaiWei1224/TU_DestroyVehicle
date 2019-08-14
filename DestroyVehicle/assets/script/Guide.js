
let self=this;
cc.Class({
    extends: cc.Component,

    properties: {
        WorkerMask:cc.Node,
        //GoldCarMask:cc.Node,
        CarMask:cc.Node,
        GoldMask:cc.Node,
        AutoBuyMask:cc.Node,
        //SpawnGoldMask:cc.Node,
        CombineMask:cc.Node,
        //CarBloodMask:cc.Node,
        //SpeedUpMask:cc.Node,
        //GiftBoxMask:cc.Node,
        //SlotsMask:cc.Node,

        GuideLable:cc.Node,

        CombineManager:null,//combinemanager script
        //DataStorage:null,

        GuideStep:Number,
        WorkerGuideStep:Number,

        HitVehicle:null,
        WorkerBody:cc.Node,
        FirstWeapon:cc.Node,
        ClickMask:cc.Node,
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
        //this.DataStorage=cc.find("Canvas").getComponent("DataStorage");
        this.GuideStep=0;
        this.WorkerGuideStep=0;
        this.CarMask.active=true;

        this.HitVehicle.count=-100000;
        this.schedule(this.StopWorker,800);
        this.GuideLable.getComponent(cc.Label).string="点击车辆砸车";
    },

    

    update (dt) {
        this.GuideUpdate();
        //console.log("   "+this.GuideStep);
    },

    GuideUpdate()
    {
        switch(this.GuideStep)
        {
            /*case 0:
                if(money.partnum>=50){
                    this.CarMask.active=false;
                    this.GoldCarMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="砸车会使您获取金钱";
                    this.GuideLable.setPosition(0,-50);
                    this.GuideStep++;
                    
                }
                break;*/
            case 0:
                if(money.partnum>=100){
                    this.CarMask.destroy();
                    this.GoldMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="您的金钱已经足够购买\n一把武器";
                    this.ClickMask.active=true;
                    this.GuideStep++;
                }
                break;
            /*case 3:
                var slot0arm=this.CombineManager.ArmArry[0];
                var slot1arm=this.CombineManager.ArmArry[1];
                if(slot1arm==0&&slot0arm==0)
                {
                    this.AutoBuyMask.destroy();
                    this.SpawnGoldMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="您放在武器栏内的武器\n会为您产出金钱";
                    this.GuideLable.setPosition(0,125);
                    this.ClickMask.active=true;
                    this.GuideStep++;
                }
                break;*/
            case 2:
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
            case 3:
                var slot0arm=this.CombineManager.ArmArry[0];
                var slot1arm=this.CombineManager.ArmArry[1];
                    if(slot1arm==1||slot0arm==1)
                    {
                        /*this.CombineMask.destroy();
                        this.CarMask.active=true;
                        this.GuideLable.getComponent(cc.Label).string="新的武器拥有更高的攻击力\n快来试试新武器的威力吧";
                        this.GuideLable.setPosition(0,-100);
                        this.GuideStep++;*/
                        this.GuideStep++;
                        this.scheduleOnce(function() {
                            this.CombineMask.destroy();
                            this.WorkerBody.active=true;
                            this.WorkerMask.active=true;
                            this.ClickMask.active=true;
                            self.node.setContentSize(1200,1800);
                            this.GuideLable.getComponent(cc.Label).string="恭喜您解锁了工人";
                            this.GuideLable.setPosition(0,0);
                            
                            console.log("this.GuideStep"+this.GuideStep);
                            this.HitVehicle.count=0;
                        }, 0.25);
                        
                    }
                    break;
            /*case 7:
                    var levelstring=this.DataStorage.level.getComponent(cc.Label).string;
                    var Carlevel=parseInt(levelstring.slice(3));
                    if(Carlevel==2)
                    {
                        this.HitVehicle.count=-100000;
                        this.CarMask.destroy();
                        this.CarBloodMask.active=true;
                        this.GuideLable.getComponent(cc.Label).string="新车拥有更高血量\n需要更多伤害才能将它摧毁";
                        this.ClickMask.active=true;
                        this.GuideLable.setPosition(0,-100);
                        this.GuideStep++;
                    }
                    
                    break;*/
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
            this.GoldMask.destroy();
            this.AutoBuyMask.active=true;
            this.GuideLable.getComponent(cc.Label).string="点击购买新武器";
            this.GuideLable.setPosition(75,-375);
            this.GuideStep++;
            this.FirstWeapon.destroy();
            var abc=require("CombineManager");
            abc.InstNewArm(0);
            this.ClickMask.active=false;
        }
        /*else if(this.GuideStep==4)
        {
            this.ClickMask.active=false;
            this.GuideLable.getComponent(cc.Label).string="即便您离线\n也会在离线的前两小时产生收益";
            this.GuideLable.setPosition(0,-375);
            this.GuideStep++;
        }*/
        /*else if(this.GuideStep==8)
        {
            this.CarBloodMask.destroy();
            this.WorkerBody.active=true;
            this.WorkerMask.active=true;
            self.node.setContentSize(1200,1800);
            this.GuideLable.getComponent(cc.Label).string="恭喜您解锁了工人";
            this.GuideLable.setPosition(0,0);
            this.GuideStep++;
            this.HitVehicle.count=0;
        }*/
        else if(this.GuideStep==4)
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
                    this.GuideStep++;
                    //this.WorkerGuideStep++;
                }
                /*else if(this.WorkerGuideStep==3)
                {
                    this.HitVehicle.count=-100000;
                    this.WorkerMask.destroy();
                    this.GuideStep++;
                    this.SpeedUpMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="此处是收益加速";
                    this.GuideLable.setPosition(0,-375);
                }*/
                
            }
            /*else if(this.GuideStep==10)
                {
                    this.GuideLable.getComponent(cc.Label).string="您可花费10钻石\n购买1分钟双倍金钱";
                    this.GuideStep++;
                }
            else if(this.GuideStep==11)
            {
                this.SpeedUpMask.destroy();
                    this.GuideStep++;
                    this.GiftBoxMask.active=true;
                    this.GuideLable.getComponent(cc.Label).string="这里是您的在线奖励";
                    this.GuideLable.setPosition(-50,50);
            }
            else if(this.GuideStep==12)
            {
                this.GuideLable.getComponent(cc.Label).string="当倒计时结束\n您将获得丰厚奖励";
                this.GuideStep++;
                
            }*/
            else if(this.GuideStep==5)
            {
                //this.HitVehicle.count=0;
                this.ExitGuide();
            } 
    },

});
