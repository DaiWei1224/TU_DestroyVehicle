var HitVehicle = require("HitVehicle");

cc.Class({
    extends: cc.Component,

    properties: {
        bloodLabel: {
            default: null,
            type: cc.Label
        },

        coinLabel: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        //text: 'Hello, World!',

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
        this.bloodLabel.string = parseInt(this.blood.progress * 100) + "%";
        //var HitVehicle = require("HitVehicle");
        //console.log(HitVehicle.coin);
        this.coinLabel.string = HitVehicle.coin;
    },
});
