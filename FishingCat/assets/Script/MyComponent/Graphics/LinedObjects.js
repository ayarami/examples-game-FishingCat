// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

let _ = require('lodash')

var LinedObjects = cc.Class({
    extends: cc.Component,

    editor: CC_EDITOR && {
        menu: '自定义组件/渲染组件/节点连线',
        requireComponent: cc.Graphics
    },

    properties: {
        mNodeA : {default : null, type : cc.Node, displayName : "线段端点节点"},
        mNodeB : {default : null, type : cc.Node, displayName : "线段端点节点"},
        mPointsCount : {default : 0, visible : false},
        mUseCurve : {default : false, displayName : "是否使用二次贝塞尔曲线"},
        _graphics : cc.Graphics,
        graphics : {
            type : cc.Graphics,
            visible : false,
            get () {
                if (cc.isValid(this._graphics)) {
                    return this._graphics;
                }
                this._graphics = this.node.getComponent(cc.Graphics);
                return this._graphics;
            }
        }
    },

    // LIFE-CYCLE CALLBACKS:

    //onLoad () {},

    start () {
        
    },

    drawGraphics(location) {
        this._drawGraphics(location);
    },

    _drawGraphics(location) {
        let point = this.node.convertToNodeSpaceAR(location);
      
        if (this.mPointsCount % 2 === 0) {
            this.graphics.moveTo(point.x, point.y);
            this.mPointsCount++;
            return;
        }

        if (point.equals(cc.v2(0,0))) return;
        
        if (this.mUseCurve) {
            this.graphics.quadraticCurveTo(point.x / 2, point.y / 2, point.x, point.y);
        }
        else {
            this.graphics.lineTo(point.x, point.y);
        }
        this.graphics.stroke();
        this.mPointsCount++;
    },

    update (dt) {
        if (CC_EDITOR) return;
        if (this.mNodeA.active === false || this.mNodeB.active === false) return;
        this.graphics.clear(false);
        this.drawGraphics(this.mNodeA.parent.convertToWorldSpaceAR(this.mNodeA.position));
        this.drawGraphics(this.mNodeB.parent.convertToWorldSpaceAR(this.mNodeB.position));
    },
});

cc.Class.Attr.setClassAttr(cc.Graphics, 'miterLimit', 'visible', false);
cc.Class.Attr.setClassAttr(cc.Graphics, 'lineJoin', 'visible', false);
cc.Class.Attr.setClassAttr(cc.Graphics, 'lineCap', 'visible', false);
cc.Class.Attr.setClassAttr(cc.Graphics, 'srcBlendFactor', 'visible', false);
cc.Class.Attr.setClassAttr(cc.Graphics, 'dstBlendFactor', 'visible', false);

module.exports = LinedObjects;