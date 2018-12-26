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
    extends: require("MyTouchComponent"),

    editor: CC_EDITOR && {
        menu: '自定义组件/触摸组件/触摸跟随',
    },

    properties: {
        mEnableTouch : {
            set (value) {
                if (this._mEnableTouch == value) return;
                this._mEnableTouch = value;
            },
            get () {
                return this._mEnableTouch;
            }
        },
        _mEnableTouch : {
            default : false, visible : false,
            notify () {
                this._updateProperty();
            }
        },
        _mIsMoving : {
            default : false, visible : false
        },
        mSpeed : {
            default : 0, displayName : '跟随速度'
        },
        _mMoveToPos : {
            default : cc.v2(0,0), visible : false
        },
        mLockX : {
            default : false, displayName : '锁定X轴'
        },
        mLockY : {
            default : false, displayName : '锁定Y轴'
        },
        TouchArea : {
            default : null, type : cc.Node, displayName : '触摸接收节点'
        }
    },

    start () {
        this._mEnableTouch = this.mEnableTouch;
    },

    _updateProperty () {
        if (this._mEnableTouch)
            this._EnableTouch();
        else
            this._DisableTouch();
    },

    _EnableTouch () {
        this.TouchArea.on(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.TouchArea.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.TouchArea.on(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.TouchArea.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        console.log("EnableTouch");
    },

    _DisableTouch () {
        this.TouchArea.off(cc.Node.EventType.TOUCH_START, this._onTouchStart, this);
        this.TouchArea.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        this.TouchArea.off(cc.Node.EventType.TOUCH_END, this._onTouchEnd, this);
        this.TouchArea.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchEnd, this);
        console.log("DisableTouch");
    },

    _onTouchStart (event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        this._mIsMoving = true;//进入移动状态
        this._mMoveToPos = this.node.parent.convertToNodeSpaceAR(touchLoc);
    },

    _onTouchMove (event) {
        var touches = event.getTouches();
        var touchLoc = touches[0].getLocation();
        this._mMoveToPos = this.node.parent.convertToNodeSpaceAR(touchLoc);
    },

    _onTouchEnd (event) {
        this._mIsMoving = false;//退出移动状态
    },

    update (dt) {
        if (!this._mIsMoving) 
        return;
        var oldPos = this.node.position;
        var direction = this._mMoveToPos.sub(oldPos).normalize();//获得移动方向
        this.mLockX && (direction.x = 0);
        this.mLockY && (direction.y = 0);
        var newPos = oldPos.add(direction.mul(this.mSpeed * dt));//根据移动速度计算新坐标
        this.node.setPosition(newPos);
    },
});
