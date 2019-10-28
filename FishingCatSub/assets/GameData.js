// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var GameData = cc.Class({
    extends: cc.Component,
    statics: {
        instance : null
    },
    properties: {
        openId : 0,
        maxScore : 0,//历史最高得分
        maxDepth : 0,//历史最高深度
        friendData : [],//好友游戏数据数组
        isDataDirty : false,//是否更新数据
        isDisplayDirty : false,//是否更新显示
    },
});

GameData.instance = new GameData();

module.exports = GameData;
