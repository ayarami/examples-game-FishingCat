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
        mPool : {
            default : null,
            visible : false
        },
        mCell : cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        if (this.mPool === null) 
        {
            this.mPool = new cc.NodePool();    
        }
    },

    createRankItem (index, imgURL, name, depth, score, openid) {
        var cellNode = this.mPool.get();
        if (!cellNode)
        {
            cellNode = cc.instantiate(this.mCell); 
        }
        var cell = cellNode.getComponent("Cell");
        cell.init(index + 1, imgURL, name, depth, score, openid);
        cellNode.y = -50 - index * 76;
        this.node.addChild(cellNode);
    },

    cleanAllCell () {
        let children = this.node.children;
        for (let index = 0; index < children.length; index++) {
            let cell = children[index];
            this.mPool.put(cell);
        }
    },

    UpdateRankList () {
        var self = this;
        this.cleanAllCell();
        for (let index = 0; index < GameData.instance.friendData.length; index++) {
            const data = GameData.instance.friendData[index];
            self.createRankItem(index, data.avatarUrl, data.nickname, data.KVDataList[0].value, data.KVDataList[1].value, data.openid);
        }
    },

    update (dt) {
        if (GameData.instance.isDisplayDirty)
        {
            this.UpdateRankList();
            GameData.instance.isDisplayDirty = false;
        }
    },
});
