//var partsLabel = 0;
//module.exports.partsLabel = partsLabel;
cc.Class({
    extends: cc.Component,

    properties: {

        layerBg: cc.Node,
        labelPfb: cc.Prefab,

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
        allBlood: {
            default: 100,
            type: cc.Integer,
            displayName: "总血量值",
        },
        restBlood:{
            default: 100,
            type: cc.Integer,
            displayName: "剩余血量"
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
        power: {
            default: 1,
            type: cc.Integer,
            displayName: "武器攻击力",
        },
        partsLabel: {
            default: null,
            type: cc.Label,
            displayName: "零件Label"
        },

    },

    onLoad () {
        this.car_level=0;
       // this.allBlood=10000;
        this.allBlood=Math.pow(1.23,this.car_level);
        this.power=weapon_info.getatk(this.car_level);
        this.allBlood=weapon_info.getatk(this.car_level)*20*this.allBlood
        this.allBlood=Math.floor(this.allBlood);
        this.restBlood=this.allBlood;
        this.bloodLabel.string = this.restBlood + "/" + this.allBlood;
       
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
        
        this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
            //获取当前点击的全局坐标
            var pos = event.getLocation();
            //获取当前点击的局部坐标
            pos=self.node.convertToNodeSpaceAR(pos);
            //console.log(pos.x, pos.y);   
   
            //设置武器击打时出现的位置
            self.weapon.x = pos.x - 50;  
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

            var pl = parseInt(self.partsLabel.string);

            if(date.getMilliseconds() % 10 == 0){
                var decBlood = self.power * 2 / self.allBlood;
                //console.log(decBlood);                
                self.blood.progress -= decBlood;     //暴击，耐久度-0.1

                self.restBlood -= self.power * 2;

                pl += 50;    //金币+50
                self.showRollNotice('-' + (self.power * 2));
            }
            else{
                var decBlood = self.power / self.allBlood;
                //console.log(decBlood);
                self.blood.progress -= decBlood;    //耐久度-0.01

                self.restBlood -= self.power;

                pl += 5;     //金币+5
                self.showRollNotice('-' + self.power);
            }  
            if(self.blood.progress>=0)
            {
                self.percentageLabel.string = /*parseInt*/Math.ceil(self.blood.progress * 100) + "%";
            }
            else{
                self.percentageLabel.string=0+"%";
            }

            

            self.partsLabel.string = pl;   //将更新后的金币数保存到label
            if(self.restBlood>=0)
            {
                self.bloodLabel.string = self.restBlood + "/" + self.allBlood;
            }
            else{
                self.bloodLabel.string = "0/" + self.allBlood;
            }
            
           // console.log(self.blood.progress);
            //module.exports.partsLabel = partsLabel;
            if(self.blood.progress <0.00001){
                //打爆车弹出窗口
                //self.changeVehicle("over", self);
                //console.log("砸车结束了！！！");
                var str=35+15*(self.car_level);
                if(self.car_level==0)
                {
                    str="10";
                }
                 
                Alert.show(str,function(){
                    //console.log("按钮被电击");
                    self.car_level+=1;//车的等级+1（从0开始）
      
                    self.allBlood=Math.pow(1.23,self.car_level);//根据公式计算的某等级的武器的上海

                    self.allBlood=weapon_info.getatk(self.car_level)*20*self.allBlood;//根据公式计算的总血量 是跟车同等级的武器砸20*1.23的n-1次方
                    self.allBlood=Math.floor(self.allBlood);//取整
                    self.restBlood=self.allBlood;
                    self.bloodLabel.string = self.restBlood + "/" + self.allBlood;//血量
                    var car=cc.find("Canvas/Blood/level").getComponent(cc.Label);//改变等级
                    var templevle=self.car_level+1;
                    var temp="Lv"+templevle;
                    car.string=temp;
                    self.percentageLabel.string=100+"%";//重置血条百分比
                    self.blood.progress=1;//重置血条
                    var filename="/vehicle/vehicle01_"+self.car_level;//申请当前等级的汽车资源
                    self.changeVehicle(filename,self);
                });
                var diamond=cc.find("Canvas/Diamonds/diamond_label").getComponent(cc.Label);
                diamond.string=parseInt(diamond.string)+parseInt(str) ;
            }else if(self.blood.progress < 0.25){
                self.changeVehicle("/vehicle/vehicle01_4", self);
            }else if(self.blood.progress < 0.5){
                self.changeVehicle("/vehicle/vehicle01_3", self);
            }else if(self.blood.progress < 0.75){
                self.changeVehicle("/vehicle/vehicle01_2", self);
            }

        });
        
    },
    createShowNode:function(str){
       
        let label = cc.instantiate(this.labelPfb);
        this.layerBg.addChild(label);

        label.getComponent(cc.Label).string = str;
        return label;
    },

    changeVehicle (fileName, self){
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

    update (dt) {       
        
    },
   

});
