cc.Class({
    extends: cc.Component,

    properties: {
        opt_item_prefab: {
            type: cc.Prefab,
            default: null,
        },

        scrollview: {
            type: cc.ScrollView,
            default: null,
        },
    },

    onLoad: function () {

        for(var i = 0; i < 10; i ++) {
            var opt_item = cc.instantiate(this.opt_item_prefab);
            this.scrollview.content.addChild(opt_item);
        }
    },


    butClick: function(){
        var anim = this.getComponent(cc.Animation);
        if(this.node.y < -700){
             anim.play("ArmsUp");
        }else{
            anim.play("ArmsDown");
        }
        
    }
    
});
