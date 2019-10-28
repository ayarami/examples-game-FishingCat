// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var Hook = require("Hook");
var GameData = require("GameData");

cc.Class({
    extends: cc.Component,

    properties: {
        mHook : {
            default : null,
            type : cc.Node
        },
        mSpeed : 350,
        mMoveToPos : {
            default : cc.v2(0,0),
            visible : false
        },
        mIsMoving : {
            default : false,
            visible : false
        },
        mEnableTouch : {
            default : false,
            visible : false
        },
        mCanvas : {
            default : null,
            type : cc.Node
        },
        mCamera : {
            default : null,
            type : cc.Camera
        }
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },

    EnableTouch () {
        if (this.mEnableTouch)
            return;
        this.mHook.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mHook.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.mHook.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.mHook.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.mEnableTouch = true;
        console.log("EnableTouch");
    },

    DisableTouch () {
        if (!this.mEnableTouch)
            return;
        this.mHook.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.mHook.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.mHook.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.mHook.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.mEnableTouch = false;
        console.log("DisableTouch");
    },

    onTouchStart (event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();//获得当前触摸点的坐标
        this.mIsMoving = true;//进入移动状态
        this.mMoveToPos = this.node.parent.convertToNodeSpaceAR(touchLoc);//将绝对坐标转换为父节点的相对坐标  
    },
    onTouchMove (event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();//获得当前触摸点的坐标
        this.mMoveToPos = this.node.parent.convertToNodeSpaceAR(touchLoc);
    },
    onTouchEnd (event) {
        this.mIsMoving = false;//退出移动状态
    },

    update (dt) {
        if (!this.mIsMoving) 
            return;
        var oldPos = this.node.position;
        var direction = this.mMoveToPos.sub(oldPos).normalize();//获得移动方向
        direction.y = 0;//锁定Y轴的移动
        var newPos = oldPos.add(direction.mul(this.mSpeed * dt));//根据移动速度计算鱼钩新的坐标
        this.node.setPosition(newPos);
    },

    onCollisionEnter: function (other , self) {
        other.node.color = cc.Color.RED;
        var pHook = this.mHook.getComponent(Hook);
        pHook.RegainLine();//鱼钩收杆

        other.node.stopAllActions();
        other.node.group = "default";//设置碰撞分组，没必要继续判断和鱼钩的碰撞了
        other.node.parent = this.node;//钓到的鱼挂在鱼钩上
        other.node.setPosition(cc.v2(0,0));
        other.node.runAction(cc.repeatForever(cc.sequence(
            cc.rotateTo(0.5 , -60 * other.node.scaleX),
            cc.rotateTo(0.5 , -30 * other.node.scaleX)
        )));//钓到的鱼挣扎动作

        GameData.instance.score = GameData.instance.score + 10;//每条鱼加10分
    }
});
