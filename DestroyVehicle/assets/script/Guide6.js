
cc.Class({
    extends: cc.Component,

    properties: {
        ClickMask:cc.Node,
        StoreMask:cc.Node,
        StoreBtnMask:cc.Node,
        DustbinMask:cc.Node,
        GuideLable:cc.Node,

        CombineManager:null,
        GuideStep:Number,
    },

    start () {
        this.ClickMask.active=false;
        this.StoreBtnMask.active=true;
        this.StoreMask.active=false;
        this.DustbinMask.active=false;
        this.GuideStep=0;
        this.CombineManager=cc.find("Canvas/SlotManager").getComponent("CombineManager");
    },

    update (dt) {
        if(this.GuideStep==0){
            var MaxArmRank=this.CombineManager.MaxArmRank;
            if(MaxArmRank==5)
            {
                this.GuideStep=1;
                this.ClickMask.active=true;
                this.StoreMask.active=true;
                this.GuideLable.active=true;
                this.StoreBtnMask.destroy();
                this.GuideLable.getComponent(cc.Label).string="恭喜您解锁了新的购买方式商城";
                this.GuideLable.setPosition(0,-375);
            }
        }
    },

    TouchDown()
    {
        switch(this.GuideStep)
        {
            case 1:
                this.GuideLable.getComponent(cc.Label).string="您可在商城中\n购买您当前最想要的武器";
                this.GuideStep++;
                break;
            case 2:
                    this.GuideLable.getComponent(cc.Label).string="也可使用钻石购买较高级的武器";
                    this.GuideStep++;
                    break;
            case 3:
                this.DustbinMask.active=true;
                this.StoreMask.destroy();
                this.GuideLable.getComponent(cc.Label).string="当您的武器栏溢满时\n您可将武器拖入回收站";
                this.GuideLable.setPosition(0,-375);
                this.GuideStep++;
                break;
            case 4:
                this.GuideLable.getComponent(cc.Label).string="回收站将根据您武器的等级\n返还相应金钱";
                this.GuideStep++;
                break;
            case 5:
                this.node.parent.destroy();
                break;
        }
    },

});
