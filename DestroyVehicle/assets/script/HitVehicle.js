//var partsLabel = 0;
//module.exports.partsLabel = partsLabel;
cc.Class({
    extends: cc.Component,

    properties: {

        labelPfb: cc.Prefab,
        CarBreakStage:Number,

        blood: {
            default: null,
            type: cc.ProgressBar,
            displayName: "血量条"
        },
        percentageLabel: {
            default: null,
            type: cc.Label,
            displayName: "剩余血量百分比"
        },
        bloodLabel:{
            default: null,
            type: cc.Label,
            displayName: "血量Label"
        },
        weapon: {
            default: null,
            type: cc.Node,
            displayName: "武器"
        },
        worker: {
            default: null,
            type: cc.Node,
            displayName: "工人手臂"
        },
        power: {
            default: 1,
            type: cc.Integer,
            displayName: "武器攻击力",
        },
        level: {
            default: null,
            type: cc.Label,
            displayName: "当前关卡数",
        },
        partsLabel: {
            default: null,
            type: cc.Label,
            displayName: "零件Label"
        },
        clickPower:
        {
            default: 0,
            type:cc.Integer,
            displayName:"点击攻击力",
        },
        vehicleAtlas:cc.SpriteAtlas,
        allBlood:0,
        restBlood:0,

    },

    onLoad () {
        var self = this;
        //用于计算工人打击的频率
        this.count = 0; 
        //初始化工人打击的位置
        this.workerPos = this.worker.getPosition();
        this.workerPos.x = 45;
        this.workerPos.y = 0;
        //根据武器等级初始化武器攻击力
        this.power = weapon_info.getatk(this.getUserData("MaxArmRank", 0));
        //关卡数变量为读取的关卡数-1
        this.car_level = parseInt(this.getUserData("level", 1)) - 1;
        this.level.string = "Lv." + (this.car_level + 1);
        this.allBlood = parseInt(this.getUserData("allBlood", 100));
        this.restBlood = parseInt(this.getUserData("restBlood", 100));
        //加载车图片
        var routeName = 'vehicle' + ((this.car_level) % 30 + 1);
        if(this.restBlood / this. allBlood < 0.25){
            routeName += '_4';
        }else if(this.restBlood / this. allBlood < 0.5){
            routeName += '_3';
        }else if(this.restBlood / this. allBlood < 0.75){
            routeName += '_2';
        }else{
            routeName += '_1';
        }
       
        self.node.getComponent(cc.Sprite).spriteFrame = self.vehicleAtlas.getSpriteFrame(routeName);
                                                                          

        this.CarBreakStage=0;
    },
    newlabel(str,callBack){
        let newNode = null;
        //console.log("正在创建新节点");
            if (!this._labelPool) {
    
                //初始化对象池
                //console.log("没有对象池");
                this._labelPool = new cc.NodePool();
            }
            if (this._labelPool.size() > 0) {
    
                //console.log("size="+this._labelPool.size() );
                //从对象池请求对象
                newNode = this._labelPool.get();
                newNode.parent=this.node;
                newNode.getComponent(cc.Label).string=str;
                newNode.setPosition(0,100);
                
                if(callBack)
                {
                  
                    callBack(newNode);
                 }
            } else {
                // 如果没有空闲对象，我们就用 cc.instantiate 重新创建
                cc.loader.loadRes("prefab/hurtBlood", cc.Prefab, function (err, prefab) {
                    if (err) {
                        console.log(err);
                        console.log("申请资源失败");
                        return;
                    }             
                    newNode = cc.instantiate(prefab);
                    
                    newNode.parent=this.node;
                    newNode.getComponent(cc.Label).string=str;
                    newNode.setPosition(0,100);
                    if(callBack)
                    {
                       
                        callBack(newNode);
                    }
                }.bind(this));
            }
    },
    newClickNode(position, callBack) {
        let newNode = null;
        if (!this._clickPool) {

            //初始化对象池
            this._clickPool = new cc.NodePool();
        }
        if (this._clickPool.size() > 0) {

            //从对象池请求对象
            newNode = this._clickPool.get();
            this.setClickNode(newNode, position, callBack);
        } else {
            // 如果没有空闲对象，我们就用 cc.instantiate 重新创建
            cc.loader.loadRes("prefab/Boom", cc.Prefab, function (err, prefab) {
                if (err) {
                    console.log(err);
                    return;
                }             
                newNode = cc.instantiate(prefab);
                this.setClickNode(newNode, position, callBack);
            }.bind(this));
        }
    },

    setClickNode(newNode, position, callBack) {
        newNode.name = "clickNode"; //设置节点名称
        //newNode.setPosition(position); //设置节点位置
        newNode.position=position;
        
        this.node.addChild(newNode); //将新的节点添加到当前组件所有节点上
        if (callBack) {
            callBack(newNode); //回调节点
        }
    },

    start () {
        var date;

        var self = this;
 
        this.node.on(cc.Node.EventType.TOUCH_START, function (event) {
            //获取当前点击的全局坐标
            var pos = event.getLocation();
            //获取当前点击的局部坐标
            pos=self.node.convertToNodeSpaceAR(pos);   
   
            //设置武器击打时出现的位置
            self.weapon.x = pos.x + 50;  
            self.weapon.y = pos.y + 200;   
            
            //播放击打动画
            var anim = self.weapon.getComponent(cc.Animation);
            anim.play();
            
            self.scheduleOnce(function(){
                //需要延时操作的内容
                self.weapon.x = 500;
                self.weapon.y = 200;  
            },0.25);

            //击打火花
            self.newClickNode(pos, function (node) {
    
                if (!node) return
                //杀死所有存在的粒子，然后重新启动粒子发射器。
                node.getComponent(cc.ParticleSystem).resetSystem();
                this.node.children.forEach(element => {
                    if (element.name === 'clickNode') {        
                        //获取粒子系统组件
                        let particle = element.getComponent(cc.ParticleSystem);       
                        //指示粒子播放是否完毕
                        if (particle.stopped) {
                            //特效播放完毕的节点放入对象池
                            this._clickPool.put(element);
                        }
                    }
                });
            }.bind(self));

            //震动效果
            let act2 = cc.sequence(cc.moveBy(0.1,-5,0),cc.moveBy(0.2,10,0),cc.moveBy(0.1,-5,0));
            self.node.runAction(act2);

            date = new Date();

            var pl = money.partnum;

            if(date.getMilliseconds() % 10 == 0){  
                var decBlood = self.clickPower*2/ self.allBlood;            
                self.blood.progress -= decBlood;     //暴击，耐久度-0.1

                self.restBlood -= self.clickPower * 2;

                pl += 5*2*10; 

                self.check(pl);
                self.newlabel('-' + self.clickPower*2,function(node){
                  
                   
                    node.runAction(cc.sequence(cc.fadeIn(0.01),cc.spawn(cc.moveBy(1,0,200),cc.fadeOut(1)),cc.callFunc(function(target){
                        self._labelPool.put(target);
                    })));
                }.bind(this));
                Sound.PlaySound("Crash1");
            }
            else{
                var decBlood = self.clickPower / self.allBlood;
                self.blood.progress -= decBlood;    //耐久度-0.01

                self.restBlood -= self.clickPower;
                pl+=5*2;
                self.check(pl);
                self.newlabel('-' + self.clickPower,function(node){
                    //console.log(node.getComponent(cc.Label).string);                    
                    node.runAction(cc.sequence(cc.fadeIn(0.01),cc.spawn(cc.moveBy(1,0,200),cc.fadeOut(1)),cc.callFunc(function(target){
                        self._labelPool.put(target);
                    })));
                }.bind(this));
                Sound.PlaySound("hit");
            } 

            if(self.blood.progress>=0)
            {
                self.percentageLabel.string = Math.ceil(self.blood.progress * 100) + "%";
            }
            else{
                self.percentageLabel.string=0+"%";
            }

            money.partnum = pl;   //将更新后的金币数保存到label
            self.partsLabel.string = money.getlabel(pl); 
            if(self.restBlood>=0)
            {
                self.bloodLabel.string = money.getlabel(self.restBlood) + "/" + money.getlabel(self.allBlood);
            }
            else{
                self.bloodLabel.string = "0/" + self.allBlood;
            }
        });
        
    },
  

    changeVehicle (fileName, self){
        Sound.PlaySound("break");
        // cc.loader.loadRes(fileName, cc.SpriteFrame, function (err, texture) {
        //     if(err){
        //         console.log(err);
        //     }                   
        //     self.node.getComponent(cc.Sprite).spriteFrame = texture;
        // });
        self.node.getComponent(cc.Sprite).spriteFrame = self.vehicleAtlas.getSpriteFrame(fileName);
    },


    //获取key对应的数据，为空设为默认值dft
    getUserData: function(key, dft) {    

        var value = cc.sys.localStorage.getItem(key);

        if(value == "" || value == null){         
            //no exist
            return dft;
        }else{
            //exist
            return value;
        }
    },

    update (dt) {
        var self = this;

        self.count++;
        //一秒60帧，120表示工人2秒砸一次
        if(self.count == 60){   
            self.count = 0;
            var anim = self.worker.getComponent(sp.Skeleton);    
            anim.clearTracks();
            anim.addAnimation(0,'zache',false,0);
            //击打火花
            
                let act2 = cc.sequence(cc.moveBy(0.1,0,0),cc.moveBy(0.1,-5,0),cc.moveBy(0.2,10,0),cc.moveBy(0.1,-5,0));
                self.node.runAction(act2);
        
           
            Sound.PlaySound("hit");
            self.newClickNode(self.workerPos, function (node) {
    
                if (!node) return
                //杀死所有存在的粒子，然后重新启动粒子发射器。
                node.getComponent(cc.ParticleSystem).resetSystem();
                this.node.children.forEach(element => {
                    if (element.name === 'clickNode') {        
                        //获取粒子系统组件
                        let particle = element.getComponent(cc.ParticleSystem);       
                        //指示粒子播放是否完毕
                        if (particle.stopped) {
                            //特效播放完毕的节点放入对象池
                            this._clickPool.put(element);
                        }
                    }
                });
            }.bind(self));

            var pl = money.partnum;

            var decBlood = self.power / self.allBlood;
            self.blood.progress -= decBlood;
            self.restBlood -= self.power;

            pl += self.power;     //金币+5
            self.check(pl);
            self.newlabel('-' + self.power,function(node){
             
                
                
                node.runAction(cc.sequence(cc.fadeIn(0.01),cc.spawn(cc.moveBy(1,0,200),cc.fadeOut(1)),cc.callFunc(function(target){
                    self._labelPool.put(target);
                })));
            }.bind(this));

            if(self.blood.progress>=0){
                self.percentageLabel.string = Math.ceil(self.blood.progress * 100) + "%";
            }
            else{
                self.percentageLabel.string = 0 + "%";
            }

            money.partnum=pl;
            self.partsLabel.string = money.getlabel(pl); ;   //将更新后的金币数保存到label

            if(self.restBlood >= 0){
                self.bloodLabel.string = money.getlabel(self.restBlood) + "/" + money.getlabel(self.allBlood);
            }
            else{
                self.bloodLabel.string = "0/" + money.getlabel(self.allBlood);
            }
        }
        /////////////////////////////////////////////////////
        var nextLevel = self.car_level + 2;
        // if(nextLevel > 30){
        //     nextLevel = 30;
        // }
        var thisImage = (nextLevel - 1) % 30;
        if(thisImage == 0){
            thisImage = 30;
        }
        var nextImage = nextLevel % 30;
        if(nextImage == 0){
            nextImage = 30;
        }
        /////////////////////////////////////////////////////
        //根据血量换车的图片和弹出弹窗
        if(self.blood.progress <0.00001){
            var str = money.getlabel(14+9*(self.car_level));
            if(self.car_level==0)
            {
                str="10";
            }
            Sound.PlaySound("bomb");
            this.CarBreakStage=0;
            //打爆车弹出窗口
            self.count=-600000;
            VehiclePopup.show(
                'prefab/NewVehicle', 
                str,
                self.getVehicleName(nextLevel),
                //self.getImageRoute(nextImage),
                nextImage,
                function(){
                self.car_level += 1;//车的等级+1（从0开始）
                self.allBlood = Math.pow(1.23,self.car_level);//根据公式计算的某等级的武器的伤害

                self.allBlood = weapon_info.getattack(self.car_level)*20*self.allBlood;//根据公式计算的总血量 是跟车同等级的武器砸20*1.23的n-1次方
                self.allBlood = Math.floor(self.allBlood);//取整
                self.restBlood = self.allBlood;
                self.bloodLabel.string = money.getlabel(self.restBlood) + "/" + money.getlabel(self.allBlood);//血量
                var car = cc.find("Canvas/Blood/level").getComponent(cc.Label);//改变等级
                car.string = "Lv." + (self.car_level + 1);
                self.percentageLabel.string = 100+"%";//重置血条百分比
                self.blood.progress = 1;//重置血条
                var filename = "vehicle" + nextImage + "_1";//申请当前等级的汽车资源
                self.changeVehicle(filename,self);
                self.count=0;
            });
            var diamond = cc.find("Canvas/Diamonds/diamond_label").getComponent(cc.Label);
            money.diamondnum=parseInt(money.diamondnum) + parseInt(str);
            diamond.string = money.getlabel(money.diamondnum);

            self.blood.progress = 1;
            //上传数据到云端
            wx.setUserCloudStorage({
                KVDataList: [{
                    key: "levelRank2",
                    value: (self.car_level + 1).toString(),
                }],
            });
        }else if(self.blood.progress < 0.25&&this.CarBreakStage==2){
            self.changeVehicle("vehicle" + thisImage + "_4", self);
            this.CarBreakStage=3;
        }else if(self.blood.progress < 0.5&&this.CarBreakStage==1){
            self.changeVehicle("vehicle" + thisImage + "_3", self);
            this.CarBreakStage=2;
        }else if(self.blood.progress < 0.75&&this.CarBreakStage==0){
            this.CarBreakStage=1;
            self.changeVehicle("vehicle" + thisImage + "_2", self);
        }    

    },

    check: function(pl){
        pl = parseInt(pl);
        var p=weapon_info.getPrice(weapon_info.weapon_kind,parseInt(weapon_info.weapon_nums[weapon_info.weapon_kind]));
        if(pl>=parseInt(p))
        {
            cc.find("Canvas/autobuyButton/mask").active=false;
        }
        else{

        }
    },

    //获取车辆名
    getVehicleName: function(level){
        switch(level){
            case 1:  return 'Lv.1 出租车';
            case 2:  return 'Lv.2 叮叮快车';
            case 3:  return 'Lv.3 里菊专车';
            case 4:  return 'Lv.4 蔚来es6';
            case 5:  return 'Lv.5 蔚来es8';
            case 6:  return 'Lv.6 蔚来es9';
            case 7:  return 'Lv.7 挑战者';
            case 8:  return 'Lv.8 战马';
            case 9:  return 'Lv.9 地狱猫';
            case 10: return 'Lv.10 克洛泽';
            case 11: return 'Lv.11 迈锐宝';
            case 12: return 'Lv.12 大黄蜂';
            case 13: return 'Lv.13 宝马3系';
            case 14: return 'Lv.14 宝马5系';
            case 15: return 'Lv.15 宝马7系';
            case 16: return 'Lv.16 保时捷718';
            case 17: return 'Lv.17 保时捷911';
            case 18: return 'Lv.18 保时捷918';
            case 19: return 'Lv.19 法拉利488';
            case 20: return 'Lv.20 法拉利812';
            case 21: return 'Lv.21 法拉利LF';
            case 22: return 'Lv.22 兰博基尼盖拉多';
            case 23: return 'Lv.23 兰博基尼蝙蝠';
            case 24: return 'Lv.24 兰博基尼毒药';
            case 25: return 'Lv.25 莱肯';
            case 26: return 'Lv.26 西贝尔';
            case 27: return 'Lv.27 黄金超跑';
            case 28: return 'Lv.28 劳斯莱斯幻影';
            case 29: return 'Lv.29 劳斯莱斯银魅';
            case 30: return 'Lv.30 劳斯莱斯金魅';

            case 31:  return 'Lv.31 出租车 II';
            case 32:  return 'Lv.32 叮叮快车 II';
            case 33:  return 'Lv.33 里菊专车 II';
            case 34:  return 'Lv.34 蔚来es6 II';
            case 35:  return 'Lv.35 蔚来es8 II';
            case 36:  return 'Lv.36 蔚来es9 II';
            case 37:  return 'Lv.37 挑战者 II';
            case 38:  return 'Lv.38 战马 II';
            case 39:  return 'Lv.39 地狱猫 II';
            case 40: return 'Lv.40 克洛泽 II';
            case 41: return 'Lv.41 迈锐宝 II';
            case 42: return 'Lv.42 大黄蜂 II';
            case 43: return 'Lv.43 宝马3系 II';
            case 44: return 'Lv.44 宝马5系 II';
            case 45: return 'Lv.45 宝马7系 II';
            case 46: return 'Lv.46 保时捷718 II';
            case 47: return 'Lv.47 保时捷911 II';
            case 48: return 'Lv.48 保时捷918 II';
            case 49: return 'Lv.49 法拉利488 II';
            case 50: return 'Lv.50 法拉利812 II';
            case 51: return 'Lv.51 法拉利LF II';
            case 52: return 'Lv.52 兰博基尼盖拉多 II';
            case 53: return 'Lv.53 兰博基尼蝙蝠 II';
            case 54: return 'Lv.54 兰博基尼毒药 II';
            case 55: return 'Lv.55 莱肯 II';
            case 56: return 'Lv.56 西贝尔 II';
            case 57: return 'Lv.57 黄金超跑 II';
            case 58: return 'Lv.58 劳斯莱斯幻影 II';
            case 59: return 'Lv.59 劳斯莱斯银魅 II';
            case 60: return 'Lv.60 劳斯莱斯金魅 II';
        }
    },

});
