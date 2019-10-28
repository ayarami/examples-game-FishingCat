// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        mSpeed : {
            default : 1,
            type : cc.Float,
            tooltip : "鱼的速度,默认正常速度为1，最小值为0.1，最大值为10",
            min : 0.1
        }
    },

    start () {
        let x = this.node.x;
        let duration = 5 - (this.node.x + 320) / 640 * 5;
        let sqeAction = cc.sequence(
            cc.moveTo(duration,cc.v2(320,this.node.y)),
            cc.flipX(true),//翻转X
            cc.moveTo(duration,cc.v2(x,this.node.y)),
            cc.moveTo(5 - duration,cc.v2(-320,this.node.y)),
            cc.flipX(false),//翻转X
            cc.moveTo(5 - duration,cc.v2(x,this.node.y)),
        );
        let action = cc.speed(cc.repeatForever(sqeAction), this.mSpeed);
        this.node.runAction(action);//重复运动

        var anim = this.node.getComponent(cc.Animation);
        var animState = anim.play("Fish");
        animState.wrapMode = cc.WrapMode.Loop;
        animState.repeatCount = Infinity;
    },

    // update (dt) {},
});
