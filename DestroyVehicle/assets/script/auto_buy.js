cc.Class({
    extends: cc.Component,

    properties: {
        weapon_kind:0,
        weapon_num:1,
        mask:cc.Node,
        label:cc.Node,
        atlas:cc.SpriteAtlas,

    },

    onLoad () {
        var self = this;

        //初始化按键信息
        self.weapon_kind = parseInt(weapon_info.changeweapon());
        self.weapon_num = parseInt(weapon_info.weapon_nums[self.weapon_kind]);

        //console.log(self.weapon_kind+ "    "+ self.weapon_num);
        var price=cc.find("Canvas/autobuyButton/priceLabel").getComponent(cc.Label);
        price.string = money.getlabel(weapon_info.getPrice(self.weapon_kind,self.weapon_num));//更新打击后价格
        //更新最优武器图片
        var weaponImage = cc.find("Canvas/autobuyButton/Sprite").getComponent(cc.Sprite);
        if(parseInt(self.weapon_kind) + 1 < 10){
            var filename = "weapon0" + (parseInt(self.weapon_kind) + 1);
        }else{
            var filename = "weapon" + (parseInt(self.weapon_kind) + 1);
        }
        /*cc.loader.loadRes(filename, cc.SpriteFrame, function (err, texture) {
            if(err){
                console.log(err);
            }                   
            weaponImage.spriteFrame = texture;
        });*/
        weaponImage.spriteFrame=self.atlas.getSpriteFrame(filename);

        var price=cc.find("Canvas/autobuyButton/priceLabel").getComponent(cc.Label);
        price.string = money.getlabel(weapon_info.getPrice(self.weapon_kind,self.weapon_num));

        money.partnum=parseInt(money.partnum);
        if(money.partnum>parseInt(weapon_info.getPrice(self.weapon_kind,weapon_info.weapon_nums[self.weapon_kind])))
        {
            cc.find("Canvas/autobuyButton/mask").active=false;
        }

        self.node.on("touchstart",function(){

            self.weapon_num = parseInt(weapon_info.weapon_nums[weapon_info.weapon_kind]);
            self.weapon_kind=weapon_info.weapon_kind;
            var sets=cc.find("Canvas/Parts/part_label").getComponent(cc.Label);
            var sets_num=money.partnum;
            
            sets_num -= parseInt(weapon_info.getPrice(self.weapon_kind,self.weapon_num));

            self.weapon_num+=1;
            weapon_info.weapon_nums[self.weapon_kind] = self.weapon_num;
            //console.log("已经购买了"+self.weapon_num);
           //扣钱
            var abc=require("CombineManager");
            var flag=abc.InstNewArm(weapon_info.weapon_kind);
            if(flag == '1')
            {
                Sound.PlaySound("buy");
                self.weapon_kind = weapon_info.changeweapon();
                self.weapon_num = weapon_info.weapon_nums[self.weapon_kind];
                //console.log("等级是"+self.weapon_kind+"数量是"+self.weapon_num);
                //更新打击后价格
                price.string = money.getlabel(weapon_info.getPrice(self.weapon_kind,weapon_info.weapon_nums[weapon_info.weapon_kind]));
                //更新最优武器图片
                var weaponImage = cc.find("Canvas/autobuyButton/Sprite").getComponent(cc.Sprite);
                if(parseInt(self.weapon_kind) + 1 < 10){
                    var filename = "weapon0" + (parseInt(self.weapon_kind) + 1);
                }else{
                    var filename = "weapon" + (parseInt(self.weapon_kind) + 1);
                }
               /* cc.loader.loadRes(filename, cc.SpriteFrame, function (err, texture) {
                    if(err){
                        console.log(err);
                    }                   
                    weaponImage.spriteFrame = texture;
                });*/
                weaponImage.spriteFrame=self.atlas.getSpriteFrame(filename);
                money.partnum=sets_num;
                sets.string = money.getlabel(sets_num);

                if(sets_num < parseInt(weapon_info.getPrice(self.weapon_kind,weapon_info.weapon_nums[self.weapon_kind]))){
                    //钱不够再买了
                    self.mask.active=true;
                }
                else{//金钱充足
                }
                    
            }
            else{
                if(sets_num <  parseInt(weapon_info.getPrice(self.weapon_kind,self.weapon_num))){
                    //钱不够再买了
                    self.mask.active=true;
                }
            }
    
            
           
        },self)
    },

    //获取key对应的数据，为空设为默认值dft
    getUserData: function(key, dft) {    

        var value = cc.sys.localStorage.getItem(key);

        if(value == "" || value == null){         
            return dft;
        }else{
            return value;
        }
    },
   
});
