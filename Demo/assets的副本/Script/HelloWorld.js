cc.Class({
    extends: cc.Component,

    properties: {
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',

        blood:{
            default: null,
            type: cc.ProgressBar
        }
    },

    // use this for initialization
    onLoad: function () {
        //this.label.string = this.text;
        
    },

    // called every frame
    update: function (dt) {       
        this.label.string = parseInt(this.blood.progress * 100) + "/100";
    },
});
