var coin = 0;
module.exports.coin = coin;

cc.Class({
    extends: cc.Component,

    properties: {
        //  血条
        blood: {
            default: null,
            type: cc.ProgressBar
        },
        //锤子
        hammer: {
            default: null,
            type: cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
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
            //self.hammer.position = pos;
            self.hammer.x = pos.x + 70;
            self.hammer.y = pos.y + 70;   

            self.hammer.angle = 40;

            let act1 = cc.sequence(cc.rotateTo(0.1,30),cc.rotateTo(0.1,-30));
            self.hammer.runAction(act1);               
            
            self.scheduleOnce(function(){
                //this.addBarriers();   //需要延时操作的内容
                self.hammer.x = 800;
                self.hammer.y = 400;  
            },0.25);       

            //console.log("time = " + date.getMilliseconds());

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

            if(date.getMilliseconds() % 10 == 0){
                self.blood.progress -= 0.1;     //暴击
                coin += 50;
            }
            else{
                self.blood.progress -= 0.01;
                coin += 5;
            }  
            module.exports.coin = coin;
            if(self.blood.progress < 0){
                self.changeVehicle("over", self);
            }else if(self.blood.progress < 0.25){
                self.changeVehicle("taxi4", self);
            }else if(self.blood.progress < 0.5){
                self.changeVehicle("taxi3", self);
            }else if(self.blood.progress < 0.75){
                self.changeVehicle("taxi2", self);
            }

        });
        
    },

    changeVehicle (fileName, self){
        cc.loader.loadRes(fileName, cc.SpriteFrame, function (err, texture) {
            if(err){
                console.log(err);
            }                   
            self.node.getComponent(cc.Sprite).spriteFrame = texture;
        });
    },

    update (dt) {       
        
    },

});
