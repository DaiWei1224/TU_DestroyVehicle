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

        NewArmWindow:cc.Prefab,

        ArmArry:[cc.Integer],//？？
        SlotPositionArry:[cc.Vec2],

        SlotRangeXArry:[cc.Vec2],
        SlotRangeYArry:[cc.Vec2],
        DustbinRange:[cc.Vec2],//
        
        ArmImagesArry:[cc.Node],
        ArmSpritFrameArry:[cc.SpriteFrame],

        CurrentArmRank:0,
        MaxArmRank:0,
        label:cc.Node,
        erning_parts:[cc.Node],
        DustbinNode:cc.Node,

        DustbinChange:Boolean,

        WeaponNode:cc.Prefab,
    },
    
    // LIFE-CYCLE CALLBACKS:
    onLoad(){
        self=this;

        self.autobuy=cc.find("Canvas/autobuyButton/mask");

        //从本地读取当前武器最高等级
        self.MaxArmRank = self.getUserData('MaxArmRank',0);
        console.log(self.MaxArmRank+"    asd");
        self.onLoadChangeArm(self.MaxArmRank);

        this.DustbinChange=false;
        //载入武器槽信息，通过零件数判断是否第一次进入游戏
        var temp = self.getUserData("parts",90);
        if(temp == 90){
            self.ArmArry = new Array(-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);
        }
        else{
            var slot = JSON.parse(cc.sys.localStorage.getItem('slot'));
            self.ArmArry = new Array(
                self.getSlotData(slot.slot01, -1),
                self.getSlotData(slot.slot02, -1),
                self.getSlotData(slot.slot03, -1),
                self.getSlotData(slot.slot04, -1),
                self.getSlotData(slot.slot05, -1),
                self.getSlotData(slot.slot06, -1),
                self.getSlotData(slot.slot07, -1),
                self.getSlotData(slot.slot08, -1),
                self.getSlotData(slot.slot09, -1),
                self.getSlotData(slot.slot10, -1),
                self.getSlotData(slot.slot11, -1),
                self.getSlotData(slot.slot12, -1));
        }
        
        //console.log("ArmArry = " + self.ArmArry);  

        //读取零件增加速度的值
        money.speednum = self.getUserData("partsSpeed", 0)
        var speed = cc.find("Canvas/Parts/add_speed_label").getComponent(cc.Label);
        speed.string = "+" + money.getlabel(money.speednum) + "/s";

        self.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            //console.log("触摸了");
            self.MouseDownSlot=self.GetSlot(event.getLocation());//得到触摸的是第几块
            console.log(parseInt(self.MouseDownPos));
            self.MouseDownOnSlot(self.MouseDownSlot,self.node.convertToNodeSpaceAR(event.getLocation()));//触摸的位置（x，y），和第几个
        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
            if(self.FollowArm)
            {
                self.FollowArm.setPosition(self.node.convertToNodeSpaceAR(event.getLocation()));
                //console.log(event.getLocation().sub(self.node.convertToWorldSpaceAR(self.DustbinNode.position)).mag());
                if(event.getLocation().sub(self.node.convertToWorldSpaceAR(self.DustbinNode.position)).mag()<=50)
                {
                    if(self.DustbinChange==false)
                    {
                        self.DustbinChange=true;
                        self.DustbinNode.opacity=240;
                        var action = cc.scaleTo(0.15, 1.05,1.05);
                        self.DustbinNode.runAction(action);
                    }
                }
                else if(self.DustbinChange)
                {
                    self.DustbinChange=false;
                    self.DustbinNode.opacity=200;
                    var action = cc.scaleTo(0.15, 1,1);
                    self.DustbinNode.runAction(action);
                }
            }
        }, self.node);
        self.node.on(cc.Node.EventType.TOUCH_END, function (event) {
            
            self.MouseUpSlot=self.GetSlot(event.getLocation());
            self.MouseUpOnSlot(self.MouseUpSlot);
        }, self.node);
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
            else{
                
                return -1;
            }

        }

        else return sloty*4+slotx;
    },


    MouseDownOnSlot(slotnum,position)
    {
        if(self.ArmArry[slotnum]>-1){
            self.SpawnFollowArm(slotnum,position);
            self.ArmImagesArry[slotnum].opacity = 100;

            //dustbineffect
            
        }
    },


    SpawnFollowArm(Armseq,position){
        var FArm = cc.instantiate(self.ArmImagesArry[Armseq]);
        //new cc.Node('newarm'+Armnum);//self.ArmPrefabArry[self.ArmArry[value]
        /*const sprite=FArm.addComponent(cc.Sprite);
        sprite.spriteFrame=self.ArmSpritFrameArry[Armnum];
        FArm.width=FArm.width/2;
        FArm.height=FArm.height/2;*/
        self.node.addChild(FArm);
        FArm.setPosition(position);
        self.FollowArm=FArm;
    },
    MouseUpOnSlot(slotnum)
    {
        if(self.MouseDownSlot==-1||self.MouseDownSlot==-2||self.ArmArry[self.MouseDownSlot]==-1) return;
        
        if(slotnum==-2)
        {
            self.ArmDelet(self.MouseDownSlot);
            console.log("delet");
        }
        else if(slotnum==-1||slotnum==self.MouseDownSlot)
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
        Sound.PlaySound("combine");
        self.ArmImagesArry[downslot].destroy();

        var speed=cc.find("Canvas/Parts/add_speed_label").getComponent(cc.Label);
        self.ArmArry[upslot]=parseInt(self.ArmArry[upslot])+1;
        
        money.speednum=parseInt(money.speednum)-parseInt(parseInt(weapon_info.getpart(self.ArmArry[downslot]))/parseFloat(weapon_info.gettime(downslot)));
        money.speednum=parseInt(money.speednum)+parseInt(weapon_info.getpart(self.ArmArry[upslot])/weapon_info.gettime(self.ArmArry[upslot]));
        speed.string="+"+money.getlabel(money.speednum)+"/s";
        self.ArmArry[downslot]=-1;
        var nodepath="Canvas/Slot/Slot"+(parseInt(downslot)+1)+"/level_num/num";
        // console.log(nodepath);
         cc.find(nodepath).getComponent(cc.Label).string=0;
         nodepath="Canvas/Slot/Slot"+(parseInt(upslot)+1)+"/level_num/num";
         cc.find(nodepath).getComponent(cc.Label).string=parseInt(self.ArmArry[upslot])+1;
        var finished = cc.callFunc(function () {
            CurrentFollowArm.destroy();
            

            self.ArmImagesArry[upslot].destroy();
            var Armi =cc.instantiate(self.WeaponNode);
            Armi.getComponent(cc.Sprite).spriteFrame=self.ArmSpritFrameArry[self.ArmArry[upslot]];
            //var Armi = cc.instantiate(self.ArmPrefabArry[self.ArmArry[upslot]]);
            //console.log(upslot+" "+self.ArmArry[upslot]);
            self.node.addChild(Armi);
            self.ArmImagesArry[upslot]=Armi;
            
            Armi.setPosition(self.SlotPositionArry[upslot]);
            if(self.ArmArry[upslot]>self.MaxArmRank)
            {
                self.MaxArmRank=self.ArmArry[upslot];
                //将更新后的最高武器等级保存到本地
                cc.sys.localStorage.setItem("MaxArmRank", self.MaxArmRank); 

                self.GetBetterArm(self.MaxArmRank);
            }

        }, this);

        var CollisionEffectA=cc.sequence(cc.moveBy(0.1,100,0),cc.moveBy(0.1,-50,0),finished);
        var CollisionEffectB=cc.sequence(cc.moveBy(0.1,-100,0),cc.moveBy(0.1,50,0));

        var CollisionEffect=cc.callFunc(function () {
            CurrentFollowArm.runAction(CollisionEffectA);
            self.ArmImagesArry[upslot].runAction(CollisionEffectB);
        }, this);

        var action = cc.sequence(cc.moveTo(0.2, self.SlotPositionArry[upslot]),CollisionEffect);
        var CurrentFollowArm=self.FollowArm;
        self.FollowArm=null;
        CurrentFollowArm.runAction(action);
        //Sound.PlaySound("combine");
        
    },



    ArmMove(downslot,upslot)
    {
        if(self.ArmArry[downslot]>-1&&self.ArmArry[upslot]==-1)
        {
            self.ArmArry[upslot]=self.ArmArry[downslot];
            self.ArmArry[downslot]=-1;

            var nodepath="Canvas/Slot/Slot"+(parseInt(downslot)+1)+"/level_num/num";
        // console.log(nodepath);
         cc.find(nodepath).getComponent(cc.Label).string=0;
         nodepath="Canvas/Slot/Slot"+(parseInt(upslot)+1)+"/level_num/num";
         cc.find(nodepath).getComponent(cc.Label).string=parseInt(self.ArmArry[upslot])+1;
            var abcc=function(){
                if(self.ArmArry[upslot]=='-1')
                {
                    self.unschedule(abcc);
                }  
                else{
                    var part =cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
                    money.partnum=parseInt(money.partnum)+parseInt(weapon_info.getpart(self.ArmArry[upslot]));
                    part.string=money.getlabel(money.partnum);
                  
                    self.erning_parts[upslot].getComponent(cc.Label).string="+$"+money.getlabel(weapon_info.getpart(self.ArmArry[upslot]));
                    console.log(money.getlabel(weapon_info.getpart(self.ArmArry[upslot])));
                    self.erning_parts[upslot].active=true;
                    self.erning_parts[upslot].runAction(cc.sequence(cc.fadeIn(0.01),cc.moveBy(0.25,0,20),cc.fadeOut(0.01),cc.moveBy(0.25,0,-20)));
                //if()
                }
                
                };         
                //console.log(weapon_info.gettime())      
                self.schedule(abcc,weapon_info.gettime(self.ArmArry[upslot]));
        }

        self.FollowArm.destroy();
        self.FollowArm=null;
            //self.ArmImagesArry[upslot]=self.ArmImagesArry[downslot];
            //self.ArmImagesArry[downslot]=null;
        self.ArmImagesArry[upslot]=self.ArmImagesArry[downslot];
        self.ArmImagesArry[downslot]=null;
        self.ArmImagesArry[upslot].setPosition(self.SlotPositionArry[upslot]);
        self.ArmImagesArry[upslot].opacity=255;
    },

    ArmChangePlace(downslot,upslot)
    {
        var temp=self.ArmArry[downslot];
        self.ArmArry[downslot]=self.ArmArry[upslot];
        self.ArmArry[upslot]=temp;

        self.FollowArm.destroy();
        var tempimage=self.ArmImagesArry[downslot];
        tempimage.opacity=255;
        self.ArmImagesArry[downslot]=self.ArmImagesArry[upslot]
        self.ArmImagesArry[upslot]=tempimage;
        self.ArmImagesArry[downslot].setPosition(self.SlotPositionArry[downslot]);
        self.ArmImagesArry[upslot].setPosition(self.SlotPositionArry[upslot]);
    },


    ArmMoveCancle(downslot)
    {
        self.FollowArm.destroy();
        self.FollowArm=null;
        self.ArmImagesArry[downslot].opacity = 255;
    },

    ArmDelet(downslot)
    {
        self.FollowArm.destroy();
        self.ArmImagesArry[downslot].destroy();
        var speed=cc.find("Canvas/Parts/add_speed_label").getComponent(cc.Label);
        
        money.speednum=parseInt(money.speednum)-parseInt(weapon_info.getpart(self.ArmArry[downslot])/weapon_info.gettime(self.ArmArry[downslot]));
        speed.string="+"+money.getlabel(money.speednum)+"/s";
        var part=cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
        
        money.partnum = parseInt(money.partnum)+Math.floor(0.8*parseInt(weapon_info.getPrice(self.ArmArry[downslot],0)));
        part.string=money.getlabel(money.partnum);
       self.ArmArry[downslot]=-1;
       var nodepath="Canvas/Slot/Slot"+(parseInt(downslot)+1)+"/level_num/num";
      // console.log(nodepath);
       cc.find(nodepath).getComponent(cc.Label).string=0;
        self.DustbinChange=false;
        self.DustbinNode.opacity=200;
        var action = cc.scaleTo(0.15, 1,1);
        self.DustbinNode.runAction(action);
    },

    ChangeSprites()
    {
        var children = self.node.children;
        console.log("childrenlength"+children.length);
        for (var i = 0; i < children.length; ++i) {
            children[i].destroy();
        }
        for(var value=0;value<12;value++)
        {
           // var nodepath="Canvas/Slot/Slot"+(parseInt(value)+1)+"/level_num/num";
            //console.log(nodepath);
            if(self.ArmArry[value]>-1)
            {
                var Armi =cc.instantiate(self.WeaponNode);
                Armi.getComponent(cc.Sprite).spriteFrame=self.ArmSpritFrameArry[self.ArmArry[value]];
                self.node.addChild(Armi);
                self.ArmImagesArry[value]=Armi;
                Armi.setPosition(self.SlotPositionArry[value]);
                var nodepath="Canvas/Slot/Slot"+(parseInt(value)+1)+"/level_num/num";
                console.log(nodepath);
                cc.find(nodepath).getComponent(cc.Label).string=parseInt(self.ArmArry[value])+1;
                self.selfSchedule(value);
            }
            else{
                var nodepath="Canvas/Slot/Slot"+(parseInt(value)+1)+"/level_num/num";
                cc.find(nodepath).getComponent(cc.Label).string=0;
            }

        }
    },

    selfSchedule(i)
    {
        console.log("i===="+i);
        var abcc=function(){
            if(self.ArmArry[i]=='-1')
            {
                self.unschedule(abcc);
            }  
            else{
                var part =cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
           
                money.partnum=parseInt(money.partnum)+parseInt(weapon_info.getpart(self.ArmArry[i]));
                if(parseInt(money.partnum)>=parseInt(weapon_info.getPrice(weapon_info.weapon_kind,weapon_info.weapon_nums[weapon_info.weapon_kind])))
                {
                    self.autobuy.active=false;
                }
                part.string=money.getlabel(money.partnum);
                console.log(weapon_info.getpart(self.ArmArry[i]));
                self.erning_parts[i].getComponent(cc.Label).string="+$"+money.getlabel(weapon_info.getpart(self.ArmArry[i]));
                self.erning_parts[i].active=true;
                self.erning_parts[i].runAction(cc.sequence(cc.fadeIn(0.01),cc.moveBy(0.25,0,20),cc.fadeOut(0.01),cc.moveBy(0.25,0,-20)));
            //if()
            }
            
            };         
            //console.log(weapon_info.gettime())      
            self.schedule(abcc,weapon_info.gettime(self.ArmArry[i]));
    },

    GetBetterArm(ArmRank)
    {
        var NewArmWindow = cc.instantiate(self.NewArmWindow);
        self.node.parent.addChild(NewArmWindow);
        NewArmWindow.getComponent("NewScript").SetArmLevel(ArmRank);
        weapon_info.level_now=self.MaxArmRank;
        self.ChangeArm(ArmRank);
    },

    ChangeArm(ArmRank)
    {
        self.MyArmNode.getComponent(cc.Sprite).spriteFrame = self.ArmSpritFrameArry[ArmRank];
       // self.WorkerArmNode.getComponent(cc.Sprite).spriteFrame = self.ArmSpritFrameArry[ArmRank];
       var numstring="";
       if(parseInt(ArmRank)<9)
       {
           numstring='0'+parseInt(parseInt(ArmRank)+1);
       }
       else
       {
           numstring=parseInt(ArmRank)+1;
       }
       console.log("numstring="+numstring);
       self.WorkerArmNode.getComponent(sp.Skeleton).setAttachment("weapon","weapon_"+numstring); 
       var car=cc.find("Canvas/Vehicle").getComponent("HitVehicle");//改变等级
        var speed=cc.find("Canvas/Parts/add_speed_label").getComponent(cc.Label);
        
        money.speednum=parseInt(money.speednum)-parseInt(weapon_info.getatk(parseInt(ArmRank)-1))/2+parseInt(weapon_info.getatk(parseInt(ArmRank)))/2;
        speed.string="+"+money.getlabel(money.speednum)+"/s";
        car.power=weapon_info.getatk(ArmRank);
        car.clickPower=weapon_info.getattack(ArmRank);
        console.log("car.clickPower11111"+car.clickPower);
    },

    onLoadChangeArm(ArmRank)
    {
        console.log(weapon_info.getattack(ArmRank)+"ggg");
        self.MyArmNode.getComponent(cc.Sprite).spriteFrame = self.ArmSpritFrameArry[ArmRank];
        //self.WorkerArmNode.getComponent(cc.Sprite).spriteFrame = self.ArmSpritFrameArry[ArmRank];
        var numstring="";
        if(parseInt(ArmRank)<9)
        {
            numstring='0'+parseInt(ArmRank+1);
        }
        else
        {
            numstring=parseInt(ArmRank+1);
        }
        console.log("numstring="+numstring);
        self.WorkerArmNode.getComponent(sp.Skeleton).setAttachment("weapon","weapon_"+numstring);
        var car=cc.find("Canvas/Vehicle").getComponent("HitVehicle");//改变等级
        car.power=weapon_info.getatk(ArmRank);
        car.clickPower=weapon_info.getattack(ArmRank);
        console.log("car.clickPower222222"+car.clickPower);
    },

    destroylab:function(){
        self.label.active=false;
        self.label.runAction(cc.sequence(cc.moveBy(0.01,0,-200),cc.fadeIn(0.01)));
    },
    
    //获取key对应的数据，为空设为默认值dft
    getUserData: function(key, dft) {    

        var value = cc.sys.localStorage.getItem(key);

        if(value == "" || value == null){         
            //console.log("no exist");
            return dft;
        }else{
            //console.log("exist");
            return value;
        }
    },

    //获取武器槽对应数据，为空设为默认值dft
    getSlotData: function(key, dft) {    

        if(key == null){     
            return dft;
        }else{
            return key;
        }
    },

     
});


    module.exports.InstNewArm=function(ArmRank)
    { 
    
        
        for(var i=0;i<12;i++)
        {
            if(self.ArmArry[i]==-1)
            {
                self.ArmArry[i]=ArmRank;
                var Armi =cc.instantiate(self.WeaponNode);
                Armi.getComponent(cc.Sprite).spriteFrame=self.ArmSpritFrameArry[self.ArmArry[i]];
                self.node.addChild(Armi);
                self.ArmImagesArry[i]=Armi;
                Armi.setPosition(self.SlotPositionArry[i]);
                var speed=cc.find("Canvas/Parts/add_speed_label").getComponent(cc.Label);
                
                money.speednum=parseInt(money.speednum)+parseInt(weapon_info.getpart(ArmRank)/weapon_info.gettime(ArmRank));
                console.log("此时塑料布"+money.speednum);
                speed.string="+"+money.getlabel(money.speednum)+"/s";
                var nodepath="Canvas/Slot/Slot"+(parseInt(i)+1)+"/level_num/num";
                cc.find(nodepath).getComponent(cc.Label).string=parseInt(ArmRank)+1;
                var abcc=function(){
                if(self.ArmArry[i]=='-1')
                {
                    self.unschedule(abcc);
                }  
                else{
                    //Sound.PlaySound("money");
                    var part =cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
               
                    money.partnum=parseInt(money.partnum)+parseInt(weapon_info.getpart(self.ArmArry[i])*weapon_info.weapon_earningspeed);
                    if(parseInt(money.partnum)>=parseInt(weapon_info.getPrice(weapon_info.weapon_kind,weapon_info.weapon_nums[weapon_info.weapon_kind])))
                    {
                        self.autobuy.active=false;
                    }
                    part.string=money.getlabel(money.partnum);
                    console.log(weapon_info.getpart(self.ArmArry[i]));
                    self.erning_parts[i].getComponent(cc.Label).string="+$"+money.getlabel(weapon_info.getpart(self.ArmArry[i]*weapon_info.weapon_earningspeed));
                    self.erning_parts[i].active=true;
                    self.erning_parts[i].runAction(cc.sequence(cc.fadeIn(0.01),cc.moveBy(0.25,0,20),cc.fadeOut(0.01),cc.moveBy(0.25,0,-20)));
                //if()
                }
                
                };         
                //console.log(weapon_info.gettime())      
                self.schedule(abcc,weapon_info.gettime(self.ArmArry[i]));
                
                
                
                var flag=1;
                return flag;
                //此处扣除金币/钻石
            }
            if(i==11&&self.ArmArry[i]>-1)
            {
                
                self.label.active=true;
                self.label.runAction(cc.sequence(cc.fadeIn(0.01),cc.moveBy(0.5,0,200),cc.fadeOut(0.01)));
                self.label.runAction(cc.moveBy(0.01,0,-200));
                flag=0;
                return flag;
            }
        }
        console.log("创建编号为"+ArmRank+"的武器");
    };