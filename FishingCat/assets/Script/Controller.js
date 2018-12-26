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

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    reset () {
        this.node.removeAllChildren(true);//清除海里面的所有鱼
        this.node.x = 0;//x轴复位
    },

    onCollisionEnter: function (other , self) {
        other.node.color = cc.Color.RED;
        cc.MsgCenter.emit("GetFish");//钓到鱼事件

        other.node.emit("GetFish", this.node);

        GameData.instance.score = GameData.instance.score + 10;//每条鱼加10分
    }
});
