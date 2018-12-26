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
var index = 0;

cc.Class({
    extends: cc.Component,

    editor: CC_EDITOR && {
        menu: '自定义组件/Label组件/更新显示属性',
        inspector: "packages://my-inspectors/inspector/label-update/dialog.js",
        playOnFocus: true,
        executeInEditMode: true, // 允许当前组件在编辑器模式下运行。
        requireComponent: cc.Label,//需要具备cc.Label组件

    },

    properties: {
        mDataEnum : {default : "GameData.instance.score", visible : false},
        mFixNum : {default : 0, displayName : "小数点保留位数"}
    },

    update (dt) {
        if (CC_EDITOR) return;
        let data = GameData.instance.score;
        if (this.mDataEnum === "GameData.instance.depth") {
            data = GameData.instance.depth;
        }
        if (typeof data === 'number') {
            data = data.toFixed(this.mFixNum);
        }
        var label = this.node.getComponent(cc.Label);
        label.string = "" + data;
    },
});
