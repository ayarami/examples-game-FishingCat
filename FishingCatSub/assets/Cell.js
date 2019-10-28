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
        mIndexLabel : cc.Label,//名次Label
        mImg : cc.Sprite,//头像Sprite
        mNameLabel : cc.Label,//名字Label
        mScoreLabel : cc.Label,//得分Label
        mOpenId : {
            default : null,
            visible : false
        },
        mDepth : {
            default : 0,
            visible : false
        },//深度，暂时无用，只记录数据
        mBack : [cc.SpriteFrame],//Cell背景图资源
        mNameNode : cc.Node,
        mScoreNode : cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    init (index, imgURL, name, depth, score, openid) {
        var bg = this.node.getComponent(cc.Sprite);
        bg.spriteFrame = this.mBack[index % 2];//交替更换背景图片

        this.mIndexLabel.string = index;//序号

        //从微信获取用户头像并加载
        let image = wx.createImage();
        image.onload = () => {
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            this.mImg.spriteFrame = new cc.SpriteFrame(texture);
        };
        image.src = imgURL;
        
        //玩家自己的名字和得分颜色为金色
        if (openid === GameData.instance.openId)
        {
            this.mNameNode.color = cc.color(255,215,0,255);
            this.mScoreNode.color = cc.color(255,215,0,255);
        }
        else
        {
            this.mNameNode.color = cc.color(255,255,255,255);
            this.mScoreNode.color = cc.color(255,255,255,255);
        }
            

        this.mNameLabel.string = name;
        
        this.mDepth = depth;
        this.mScoreLabel.string = score;
        this.mOpenId = openid;
    }

    // update (dt) {},
});
