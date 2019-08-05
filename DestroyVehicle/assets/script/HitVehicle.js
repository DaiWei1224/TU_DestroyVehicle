//var partsLabel = 0;
//module.exports.partsLabel = partsLabel;
cc.Class({
    extends: cc.Component,

    properties: {

        layerBg: cc.Node,
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
        }

    },

    onLoad () {
        // //this.allBlood=10000;
        // this.allBlood=Math.pow(1.23,this.car_level);
        //this.power=weapon_info.getatk(this.car_level);
        // this.allBlood=weapon_info.getatk(this.car_level)*20*this.allBlood
        // this.allBlood=Math.floor(this.allBlood);
        // this.restBlood=this.allBlood;
        // this.bloodLabel.string = this.restBlood + "/" + this.allBlood;

        var self = this;
        //用于计算工人打击的频率
        this.count = 0; 
        //初始化工人打击的位置
        this.workerPos = this.worker.getPosition();
        this.workerPos.x = 45;
        this.workerPos.y = 25;
        //根据武器等级初始化武器攻击力
        this.power = weapon_info.getatk(this.getUserData("MaxArmRank", 0));
        //关卡数变量为读取的关卡数-1
        this.car_level = parseInt(this.getUserData("level", 1)) - 1;
        this.level.string = "Lv." + (this.car_level + 1);
        this.allBlood = parseInt(this.getUserData("allBlood", 100));
        this.restBlood = parseInt(this.getUserData("restBlood", 100));
        //加载车图片
        var routeName = '/vehicle/vehicle' + ((this.car_level)%3 + 1);
        if(this.restBlood / this. allBlood < 0.25){
            routeName += '_4';
        }else if(this.restBlood / this. allBlood < 0.5){
            routeName += '_3';
        }else if(this.restBlood / this. allBlood < 0.75){
            routeName += '_2';
        }else{
            routeName += '_1';
        }
        cc.loader.loadRes(routeName, cc.SpriteFrame, function (err, texture) {
            if(err){
                console.log(err);
            }                   
            self.node.getComponent(cc.Sprite).spriteFrame = texture;
        });
        this.CarBreakStage=0;
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
            //console.log(pos.x, pos.y);   
   
            //设置武器击打时出现的位置
            self.weapon.x = pos.x + 50;  
            self.weapon.y = pos.y + 200;   

            //通过代码设计击打动画
            //self.weapon.angle = -80;
            //let act1 = cc.sequence(cc.rotateTo(0.1,-20),cc.rotateTo(0.1,-80));
            //self.weapon.runAction(act1);    
            
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
                //cc.log("子节点数:" + this.node.children.length);
                this.node.children.forEach(element => {
                    if (element.name === 'clickNode') {        
                        //获取粒子系统组件
                        let particle = element.getComponent(cc.ParticleSystem);       
                        //指示粒子播放是否完毕
                        if (particle.stopped) {
                            //特效播放完毕的节点放入对象池
                            this._clickPool.put(element);
                            //cc.log("顺利回收...");
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
               // var decBlood = self.power * 2 / self.allBlood;
                //console.log(decBlood);    
                var decBlood = self.clickPower*2/ self.allBlood;            
                self.blood.progress -= decBlood;     //暴击，耐久度-0.1

                //self.restBlood -= self.power * 2;
                //self.restBlood -= 5 * 2;
                self.restBlood -= self.clickPower * 2;

                //pl += self.power*10;     //金币+50
                pl += 5*2*10; 
                //self.showRollNotice('-' + (self.power * 2));
                self.check(pl);
                self.showRollNotice('-' + self.clickPower*2);
                //Sound.PlaySound("Crash");
                Sound.PlaySound("hit");
            }
            else{
                //var decBlood = self.power / self.allBlood;
                //console.log(decBlood);
                var decBlood = self.clickPower / self.allBlood;
                self.blood.progress -= decBlood;    //耐久度-0.01

                //self.restBlood -= self.power;
                self.restBlood -= self.clickPower;
                console.log("攻击力"+self.power);
                //pl += self.power;      //金币+5
                pl+=5*2;
                self.check(pl);
                //self.showRollNotice('-' + self.power);
                self.showRollNotice('-' + self.clickPower);
                Sound.PlaySound("hit");
            } 

            if(self.blood.progress>=0)
            {
                self.percentageLabel.string = /*parseInt*/Math.ceil(self.blood.progress * 100) + "%";
            }
            else{
                self.percentageLabel.string=0+"%";
            }

            money.partnum = pl;   //将更新后的金币数保存到label
            self.partsLabel.string = money.getlabel(pl); 
            if(self.restBlood>=0)
            {
                self.bloodLabel.string = self.restBlood + "/" + self.allBlood;
            }
            else{
                self.bloodLabel.string = "0/" + self.allBlood;
            }

            //module.exports.partsLabel = partsLabel;

        });
        
    },
    createShowNode:function(str){
       
        let label = cc.instantiate(this.labelPfb);
        this.layerBg.addChild(label);

        label.getComponent(cc.Label).string = str;
        return label;
    },

    changeVehicle (fileName, self){
        Sound.PlaySound("break");
        cc.loader.loadRes(fileName, cc.SpriteFrame, function (err, texture) {
            if(err){
                console.log(err);
            }                   
            self.node.getComponent(cc.Sprite).spriteFrame = texture;
        });
    },
    showRollNotice(str) {
        //console.log("开始执行主程序");
        let label = this.createShowNode(str);

        //时间 秒数
        let holdTime = 1;

         // var callback = cc.callFunc(this.onComplete, this);
        let sequence = cc.sequence(cc.spawn(cc.fadeTo(holdTime, 0),cc.moveTo(holdTime,0,500)), cc.callFunc(function(target, score) {
            //this.rollNoticeList.shift();
            // target.removeFromParent(false)
            target.destroy();
        }, this))//动作完成后删除
        label.runAction(sequence);

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

    update (dt) {
        var self = this;

        self.count++;
        //一秒60帧，120表示工人2秒砸一次
        if(self.count == 120){   
            self.count = 0;
            var anim = self.worker.getComponent(cc.Animation);
            anim.play();
            //击打火花
            Sound.PlaySound("hit");
            self.newClickNode(self.workerPos, function (node) {
    
                if (!node) return
                //杀死所有存在的粒子，然后重新启动粒子发射器。
                node.getComponent(cc.ParticleSystem).resetSystem();
                //cc.log("子节点数:" + this.node.children.length);
                this.node.children.forEach(element => {
                    if (element.name === 'clickNode') {        
                        //获取粒子系统组件
                        let particle = element.getComponent(cc.ParticleSystem);       
                        //指示粒子播放是否完毕
                        if (particle.stopped) {
                            //特效播放完毕的节点放入对象池
                            this._clickPool.put(element);
                            //cc.log("顺利回收...");
                        }
                    }
                });
            }.bind(self));

            var pl = money.partnum;

            var decBlood = self.power / self.allBlood;
            self.blood.progress -= decBlood;
            self.restBlood -= self.power;

            pl += self.power;     //金币+5
            console.log("攻击力"+self.power);
            self.check(pl);
            self.showRollNotice('-' + self.power);

            if(self.blood.progress>=0){
                self.percentageLabel.string = /*parseInt*/Math.ceil(self.blood.progress * 100) + "%";
            }
            else{
                self.percentageLabel.string = 0 + "%";
            }

            money.partnum=pl;
            self.partsLabel.string = money.getlabel(pl); ;   //将更新后的金币数保存到label

            if(self.restBlood >= 0){
                self.bloodLabel.string = self.restBlood + "/" + self.allBlood;
            }
            else{
                self.bloodLabel.string = "0/" + self.allBlood;
            }
        }

        //根据血量换车的图片和弹出弹窗
        if(self.blood.progress <0.00001){
            
            var str = 14+9*(self.car_level);
            if(self.car_level==0)
            {
                str="10";
            }
            Sound.PlaySound("bomb");
            this.CarBreakStage=0;
            //打爆车弹出窗口
            VehiclePopup.show(
                'prefab/NewVehicle', 
                str,
                //self.getVehicleName(self.car_level + 2),
                self.getVehicleName(1),
                //self.getImageRoute(self.car_level + 2),
                self.getImageRoute(1),
                function(){
                self.car_level += 1;//车的等级+1（从0开始）
                self.allBlood = Math.pow(1.23,self.car_level);//根据公式计算的某等级的武器的伤害

                self.allBlood = weapon_info.getatk(self.car_level)*10*self.allBlood;//根据公式计算的总血量 是跟车同等级的武器砸20*1.23的n-1次方
                //self.allBlood=200*Math.pow(1.35,self.car_level);
                self.allBlood = Math.floor(self.allBlood);//取整
                self.restBlood = self.allBlood;
                self.bloodLabel.string = self.restBlood + "/" + self.allBlood;//血量
                var car = cc.find("Canvas/Blood/level").getComponent(cc.Label);//改变等级
                // var templevle=self.car_level+1;
                // var temp="Lv."+templevle;
                // car.string = temp;
                car.string = "Lv." + (self.car_level + 1);
                self.percentageLabel.string = 100+"%";//重置血条百分比
                self.blood.progress = 1;//重置血条
                //var filename="/vehicle/vehicle1_"+self.car_level;//申请当前等级的汽车资源
                var filename = "/vehicle/vehicle" + ((self.car_level + 1) % 3 + 1) + "_1";//申请当前等级的汽车资源
                self.changeVehicle(filename,self);
            });
            var diamond = cc.find("Canvas/Diamonds/diamond_label").getComponent(cc.Label);
            money.diamondnum=parseInt(money.diamondnum) + parseInt(str);
            diamond.string = money.getlabel(money.diamondnum);

            self.blood.progress = 1;
            
        }else if(self.blood.progress < 0.25&&this.CarBreakStage==2){
            self.changeVehicle("/vehicle/vehicle" + ((self.car_level + 1) % 3 + 1) + "_4", self);
            this.CarBreakStage=3;
        }else if(self.blood.progress < 0.5&&this.CarBreakStage==1){
            self.changeVehicle("/vehicle/vehicle" + ((self.car_level + 1) % 3 + 1) + "_3", self);
            this.CarBreakStage=2;
        }else if(self.blood.progress < 0.75&&this.CarBreakStage==0){
            this.CarBreakStage=1;
            self.changeVehicle("/vehicle/vehicle" + ((self.car_level + 1) % 3 + 1) + "_2", self);
        }    

    },

    check:function(pl){
        pl=parseInt(money.partnum);
        //console.log("签署者"+money.partnum);
        //var price=cc.find("Canvas/autobuyButton/priceLabel").getComponent(cc.Label);
        var p=weapon_info.getPrice(weapon_info.weapon_kind,parseInt(weapon_info.weapon_nums[weapon_info.weapon_kind]));
        if(pl>=parseInt(p))
        {
            console.log(pl+"  "+ weapon_info.weapon_kind+"  "+weapon_info.weapon_nums[weapon_info.weapon_kind]);
            console.log(parseInt(weapon_info.getPrice(weapon_info.weapon_kind,weapon_info.weapon_nums[weapon_info.weapon_kind])+1));
            cc.find("Canvas/autobuyButton/mask").active=false;
        }
        else{
            console.log("当前的钱为"+ pl + "价格为" + p);
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
        }
    },
    //获取车辆图片路径
    getImageRoute: function(level){
        switch(level){
            case 1:  return '/vehicle/vehicle1_1';
            case 2:  return '/vehicle/vehicle2_1';
            case 3:  return '/vehicle/vehicle3_1';
            case 4:  return '/vehicle/vehicle4_1';
            case 5:  return '/vehicle/vehicle5_1';
            case 6:  return '/vehicle/vehicle6_1';
            case 7:  return '/vehicle/vehicle7_1';
            case 8:  return '/vehicle/vehicle8_1';
            case 9:  return '/vehicle/vehicle9_1';
            case 10: return '/vehicle/vehicle10_1';
            case 11: return '/vehicle/vehicle11_1';
            case 12: return '/vehicle/vehicle12_1';
            case 13: return '/vehicle/vehicle13_1';
            case 14: return '/vehicle/vehicle14_1';
            case 15: return '/vehicle/vehicle15_1';
            case 16: return '/vehicle/vehicle16_1';
            case 17: return '/vehicle/vehicle17_1';
            case 18: return '/vehicle/vehicle18_1';
            case 19: return '/vehicle/vehicle19_1';
            case 20: return '/vehicle/vehicle20_1';
            case 21: return '/vehicle/vehicle21_1';
            case 22: return '/vehicle/vehicle22_1';
            case 23: return '/vehicle/vehicle23_1';
            case 24: return '/vehicle/vehicle24_1';
            case 25: return '/vehicle/vehicle25_1';
            case 26: return '/vehicle/vehicle26_1';
            case 27: return '/vehicle/vehicle27_1';
            case 28: return '/vehicle/vehicle28_1';
            case 29: return '/vehicle/vehicle29_1';
            case 30: return '/vehicle/vehicle30_1';
        }
    },

});
