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
        menu: '自定义组件/触摸组件/触摸拖动',
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
            default : false,
            visible : false,
            notify () {
                this._updateProperty();
            }
        },
        mLockX : {
            default : false, displayName : '锁定X轴'
        },
        mLockY : {
            default : false, displayName : '锁定Y轴'
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
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        console.log("EnableTouch");
    },

    _DisableTouch () {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMove, this);
        console.log("DisableTouch");
    },

    _onTouchMove (event) {
        var touches = event.getTouches();
        var touchLoc = this.node.parent.convertToNodeSpaceAR(touches[0].getLocation());//获得当前触摸点的坐标
        var preTouchLoc = this.node.parent.convertToNodeSpaceAR(touches[0].getPreviousLocation());//获得前一帧触摸点的坐标
        var addPos = touchLoc.sub(preTouchLoc);
        this.mLockX && (addPos.x = 0);
        this.mLockY && (addPos.y = 0);
        this.node.position = this.node.position.add(addPos);
    },
});
