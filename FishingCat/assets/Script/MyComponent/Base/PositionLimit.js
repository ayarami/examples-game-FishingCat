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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
        LimitX : {
            default : false,
            displayName : "锁定X轴",
            notify () {
                this._updateProperty();
            }
        },
        LimitY : {
            default : false,
            displayName : "锁定Y轴",
            notify () {
                this._updateProperty();
            }
        },
        _pos : {default : cc.v2(0,0)}
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._pos = this.node.position;
    },

    _updateProperty () {
        this._pos = this.node.position;
    },

    lateUpdate (dt) {
        if (this.LimitX) {
            this.node.x = this._pos.x;
        }
        if (this.LimitY) {
            this.node.y = this._pos.y;
        }
    }

    // update (dt) {},
});
