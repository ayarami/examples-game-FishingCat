"use strict";

var Texture2D = cc.Texture2D;

if (Texture2D) {
    Object.assign(Texture2D.prototype, {
        initWithElement: function initWithElement(element) {
            if (!element) return;
            this._image = element;
            this.handleLoadedTexture();
        }
    });
}