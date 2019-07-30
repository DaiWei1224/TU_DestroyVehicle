// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        weapon_kind:0,
        weapon_num:1,
        mask:cc.Node,
        label:cc.Node,
        //mask:cc.Node,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        
     },

    start () {
        console.log("这个程序开始执行了");
        var self=this;
        
        var price=cc.find("Canvas/autobuyButton/priceLabel").getComponent(cc.Label);
        price.string=weapon_info.getPrice(self.weapon_kind,self.weapon_num);
        self.node.on("touchstart",function(){
            console.log("触摸程序执行了");
            var sets=cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
            var sets_num=sets.string;
            //var price=cc.find("New Canvas/auto_buy/auto_lable").getComponent(cc.Label);
            sets_num-=price.string;
            if(sets_num<0)
            {
                console.log("金钱不足");
                
            }
            else{
                console.log("已经购买了编号为"+self.weapon_kind+"的武器，此时已经购买了"+self.weapon_num+"把");
                self.weapon_num+=1;
                weapon_info.weapon_nums[self.weapon_kind]=self.weapon_num;
                sets.string=sets_num;//扣钱
                console.log("现在还剩"+sets.string+"个零件");
                var abc=require("CombineManager");
                var flag=abc.InstNewArm(self.weapon_kind);
                console.log(flag);
                if(flag == '1')
                {
                    self.weapon_kind=weapon_info.changeweapon();
                    console.log("编号为"+self.weapon_kind);
                    self.weapon_num=weapon_info.weapon_nums[self.weapon_kind];
                    console.log(self.weapon_num);
                    price.string=weapon_info.getPrice(self.weapon_kind,self.weapon_num);//更新打击后价格
                    if(sets_num < parseInt(price.string)){
                        console.log("钱不够再买了")
                        self.mask.active=true;
                    }
                    else{
                        console.log(sets_num);
                        console.log(price.string);
                        console.log("金钱充足");
                    }
                    
                }
                
               
            }
            
           
        },self)
    },

    // update (dt) {},
   
});
