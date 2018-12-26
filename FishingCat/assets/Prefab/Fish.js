// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let AnimNameEnum = cc.Enum({
    None : 0
});

var Fish = cc.Class({
    extends: cc.Component,

    editor: CC_EDITOR && {
        executeInEditMode : true
    },

    properties: {
        mSpeed : {
            default : 1,
            type : cc.Float,
            tooltip : "鱼的速度,默认正常速度为1，最小值为0.1，最大值为10",
            min : 0.1
        },
        AnimName : {
            default : 0,
            type : AnimNameEnum
        },
    },

    __preload () {//自动检索animtion中的clips，并提供给属性面板进行选择
        if (CC_EDITOR) {
            var anim = this.node.getComponent(cc.Animation);
            var clips = anim.getClips();

            let names = {};
            for (let i = 0; i < clips.length; i++) {
                const element = clips[i];
                names[element.name] = i;
            }

            let array = Object.keys(names);
            let AnimNameString = array.map((name, value) => {
                return {name, value};
            });

            let obj = {};
            array.forEach((name, index) => obj[name] = index);

            AnimNameEnum = cc.Enum(obj);
            cc.Class.Attr.setClassAttr(Fish, 'AnimName', 'enumList', AnimNameString);
        }
    },

    onLoad () {
        this.node.on("GetFish", this.beCatched, this);
    },

    start () {
        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play(anim.getClips()[this.AnimName].name);
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
    },

    beCatched (controller) {
        this.node.stopAllActions();
        this.node.group = "default";//设置碰撞分组，没必要继续判断和鱼钩的碰撞了
        this.node.parent = controller;//钓到的鱼挂在鱼钩上
        this.node.setPosition(cc.v2(0,0));
        var anim = this.node.getComponent(cc.Animation);
        var animationClip = this.node.scaleX < 0 ? "GetFish2" : "GetFish1";
        anim.play(animationClip);
    }

    // update (dt) {},
});

module.exports = Fish;