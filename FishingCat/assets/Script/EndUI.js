// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var GameData = require("GameData");

cc.Class({
    extends: cc.Component,

    properties: {
        mScoreLabel : cc.RichText,
        mDepthLabel : cc.RichText
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    Hide () {
        this.node.active = false;
    },

    Show () {
        this.node.active = true;
        this.mScoreLabel.string = "<color=#ffd700>" + GameData.instance.score + "</c>";
        this.mDepthLabel.string = "<color=#00ff00>深度:" + GameData.instance.depth.toFixed(2) + "</c>";
        wx.postMessage({
            message :   "UploadGameData",
            score : GameData.instance.score,
            depth : GameData.instance.depth.toFixed(2)
        });
    }

    // update (dt) {},
});
