'use strict';

var Audio = cc.Audio;

if (Audio) {
    Object.assign(Audio.prototype, {
        _createElement: function _createElement() {
            var elem = this._src._nativeAsset;
            // Reuse dom audio element
            if (!this._element) {
                this._element = __globalAdapter.createInnerAudioContext();
            }
            this._element.src = elem.src;
        },
        destroy: function destroy() {
            if (this._element) {
                this._element.destroy();
                this._element = null;
            }
        },
        setCurrentTime: function setCurrentTime(num) {
            if (!this._element) {
                this._nextTime = num;
                return;
            }
            this._nextTime = 0;
            this._element.seek(num);
        },
        stop: function stop() {
            if (!this._element) return;
            this._element.pause();
            this._element.seek(0);
            this._unbindEnded();
            this.emit('stop');
            this._state = Audio.State.STOPPED;
        },
        _bindEnded: function _bindEnded(callback) {
            callback = callback || this._onended;
            var elem = this._element;
            if (elem) {
                elem.onEnded && elem.onEnded(callback);
            }
        },
        _unbindEnded: function _unbindEnded() {
            var elem = this._element;
            if (elem) {
                elem.offEnded && elem.offEnded();
            }
        },


        // adapt some special operations on web platform
        _touchToPlay: function _touchToPlay() {},
        _forceUpdatingState: function _forceUpdatingState() {}
    });
}