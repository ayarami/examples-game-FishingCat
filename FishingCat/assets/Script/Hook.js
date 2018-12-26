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
        RegainSpeed : 320,
        isRegaining : {
            default : false,
            visible : false
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        cc.MsgCenter.on("StartLine", this.StartLine, this);
        cc.MsgCenter.on("GetFish", this.RegainLine, this);
    },

    start () {
        //this.StartLine();
    },

    StartAnim () {
        var anim = this.getComponent(cc.Animation);
        anim.play('HookAnim');//播放指定动画
    },

    StartLine () {
        this.node.stopAllActions();
        this.node.runAction(cc.repeatForever(cc.moveBy(2,cc.p(0,-100))));
        this.isRegaining = false;
    },

    RegainLine () {//收杆
        if (this.isRegaining)
            return;
        this.node.stopAllActions();//停止下沉动作
        var duration = Math.abs(this.node.y) / this.RegainSpeed;
        if (duration < 2) duration = 2;//收杆事件太快，不足5秒的，按5秒来运动
        this.node.runAction(cc.sequence(
            cc.moveTo(duration, cc.v2(0,0)).easing(cc.easeSineIn()),
            cc.callFunc(function (){
                //显示结束界面
                cc.MsgCenter.emit('EndUI-Show');
            })
        ));//收杆动作，通过easing来优化效果
        this.isRegaining = true;
    },
});
