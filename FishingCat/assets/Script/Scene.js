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
        mPrefab : {
            default : null,
            type : cc.Prefab
        },
        mFishPool : {
            default : null,
            type : cc.Node
        },
        mHook : {
            default : null,
            type : cc.Node
        },
        mDepth : {
            default : 0,
            type : cc.Float,
            visible : false
        },
        mSceneData : {
            default : null,
            type : cc.JsonAsset
        },
        mIndex : {
            default : 0,
            visible : false
        },
        mController : {
            default : null,
            type : cc.Node
        }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var manager = cc.director.getCollisionManager();//获取碰撞检测系统
        manager.enabled = true;//默认碰撞检测系统是禁用的，需要手动开启碰撞检测系统
        manager.enabledDebugDraw = true;//开启后可在debug中显示碰撞区域
    },

    reset () {
        GameData.instance.depth = 0;
        GameData.instance.score = 0;
        //清除鱼钩上挂着的鱼
        this.mFishPool.removeAllChildren(true);
        //清除海里面的所有鱼
        this.mController.removeAllChildren(true);
        this.mController.x = 0;
    },

    start () {

    },

    update (dt) {
        var depth = Math.abs(this.mHook.y) / 100;
        this.mDepth = Math.floor(depth);// 100pixel = 1 m
        let data = this.mSceneData.json[this.mIndex];
        if (data != undefined && this.mDepth >= data.depth)//到达配置的位置时，生成一只鱼
        {
            var fish = cc.instantiate(this.mPrefab);

            cc.loader.loadRes(data.res,cc.SpriteFrame,function(err,spriteFrame){
                if (!err)
                    fish.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });//更换图片外观

            fish.x = Math.random() * 640 - 320;//随机X轴坐标
            fish.y = this.mHook.y - 480 - 100;//在屏幕可视范围下方提前生成
            this.mFishPool.addChild(fish);
            this.mIndex++;
        }

        GameData.instance.depth = Math.max(GameData.instance.depth , depth);
    },
});
