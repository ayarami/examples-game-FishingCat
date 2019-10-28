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
        wx.onMessage(data => {
            switch (data.message) {
                case 'SetOpenId' :
                {
                    //openid登陆时主域获取，传到子域使用。
                    //data: {message:'SetOpenId', openid:"xxxxxxxxxxxxx"}
                    GameData.instance.openId = data.openid;
                    GameData.instance.isDataDirty = true;
                }
                case 'UploadGameData' : {
                    //上传得分
                    //data: {message:'UploadGameData', score:999, depth:999}
                    this.UploadGameData(data.score, data.depth);
                }
            }
        });
    },

    //上传玩家游戏数据
    UploadGameData (score , depth) {
        var maxScore = Math.max(score, GameData.instance.maxScore);
        var maxDepth = Math.max(depth, GameData.instance.maxDepth);
        if (maxScore > GameData.instance.maxScore || maxDepth > GameData.instance.maxDepth)
        {
            GameData.instance.maxScore = maxScore;
            GameData.instance.maxDepth = maxDepth;//记录最高分

            wx.setUserCloudStorage({
                KVDataList  :   [
                    { "key":'depth', "value": "" + GameData.instance.maxDepth },
                    { "key":'score', "value": "" + GameData.instance.maxScore }
                ],
                success :   function(){
                    console.log("上传成功!");
                    GameData.instance.isDataDirty = true;
                }
            });
        }
    },

    //获得玩家游戏数据
    GetUserGameData () {
        wx.getUserCloudStorage({
            keyList : ["depth" , "score"],//要获取数据的key列表
            success :   function(res){
                console.log("下载玩家游戏数据成功!");
                if (res.KVDataList.length > 0)
                {
                    GameData.instance.maxDepth = res.KVDataList[0].value;
                    GameData.instance.maxScore = res.KVDataList[1].value;
                }
            }
        });
    },

    //获得玩家的好友游戏数据
    GetFriendGameData () {
        var self = this;
        wx.getFriendCloudStorage({
            keyList : ["depth" , "score"],
            success :   function(res){
                console.log("下载好友游戏数据成功!")
                GameData.instance.friendData = res.data;
                self.SortFriendGameData();
                GameData.instance.isDisplayDirty = true;//更新排行榜显示
            }
        });
    },

    //好友游戏数据排序，按得分从高到低
    SortFriendGameData () {
        var compareScore = function (x, y) {//比较得分
            var value1 = parseInt(x.KVDataList[0].value);
            var value2 = parseInt(y.KVDataList[0].value);
            if (value1 <= value2) {
                return 1;
            } else if (value1 > value2) {
                return -1;
            }
        }

        GameData.instance.friendData.sort(compareScore);
    },

    update (dt) {
        if (GameData.instance.isDataDirty)
        {
            this.GetUserGameData();
            this.GetFriendGameData();
            GameData.instance.isDataDirty = false;
        }
    },
});
