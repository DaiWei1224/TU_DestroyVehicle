cc.Class({
    extends: cc.Component,

    properties: {
        
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
