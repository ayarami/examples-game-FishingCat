'use strict';

(function () {
    if (!(cc && cc.EditBox)) {
        return;
    }

    var EditBox = cc.EditBox;
    var js = cc.js;
    var KeyboardReturnType = EditBox.KeyboardReturnType;
    var _currentEditBoxImpl = null;

    function getKeyboardReturnType(type) {
        switch (type) {
            case KeyboardReturnType.DEFAULT:
            case KeyboardReturnType.DONE:
                return 'done';
            case KeyboardReturnType.SEND:
                return 'send';
            case KeyboardReturnType.SEARCH:
                return 'search';
            case KeyboardReturnType.GO:
                return 'go';
            case KeyboardReturnType.NEXT:
                return 'next';
        }
        return 'done';
    }

    function MiniGameEditBoxImpl() {
        this._delegate = null;
        this._editing = false;

        this._eventListeners = {
            onKeyboardInput: null,
            onKeyboardConfirm: null,
            onKeyboardComplete: null
        };
    }

    js.extend(MiniGameEditBoxImpl, EditBox._ImplClass);
    EditBox._ImplClass = MiniGameEditBoxImpl;

    Object.assign(MiniGameEditBoxImpl.prototype, {
        init: function init(delegate) {
            if (!delegate) {
                cc.error('EditBox init failed');
                return;
            }
            this._delegate = delegate;
        },
        setFocus: function setFocus(value) {
            if (value) {
                this.beginEditing();
            } else {
                this.endEditing();
            }
        },
        isFocused: function isFocused() {
            return this._editing;
        },
        beginEditing: function beginEditing() {
            // In case multiply register events
            if (_currentEditBoxImpl === this) {
                return;
            }
            var delegate = this._delegate;
            // handle the old keyboard
            if (_currentEditBoxImpl) {
                var currentImplCbs = _currentEditBoxImpl._eventListeners;
                currentImplCbs.onKeyboardComplete();

                __globalAdapter.updateKeyboard && __globalAdapter.updateKeyboard({
                    value: delegate._string
                });
            }

            this._registerKeyboardEvent();
            this._showKeyboard();

            this._editing = true;
            _currentEditBoxImpl = this;
            delegate.editBoxEditingDidBegan();
        },
        endEditing: function endEditing() {
            this._hideKeyboard();
            var cbs = this._eventListeners;
            cbs.onKeyboardComplete && cbs.onKeyboardComplete();
        },
        _registerKeyboardEvent: function _registerKeyboardEvent() {
            var self = this;
            var delegate = this._delegate;
            var cbs = this._eventListeners;

            cbs.onKeyboardInput = function (res) {
                if (res.value.length > delegate.maxLength) {
                    res.value = res.value.slice(0, delegate.maxLength);
                }
                if (delegate._string !== res.value) {
                    delegate.editBoxTextChanged(res.value);
                }
            };

            cbs.onKeyboardConfirm = function (res) {
                delegate.editBoxEditingReturn();
                var cbs = self._eventListeners;
                cbs.onKeyboardComplete && cbs.onKeyboardComplete();
            };

            cbs.onKeyboardComplete = function () {
                self._editing = false;
                _currentEditBoxImpl = null;
                self._unregisterKeyboardEvent();
                delegate.editBoxEditingDidEnded();
            };

            __globalAdapter.onKeyboardInput(cbs.onKeyboardInput);
            __globalAdapter.onKeyboardConfirm(cbs.onKeyboardConfirm);
            __globalAdapter.onKeyboardComplete(cbs.onKeyboardComplete);
        },
        _unregisterKeyboardEvent: function _unregisterKeyboardEvent() {
            var cbs = this._eventListeners;

            if (cbs.onKeyboardInput) {
                __globalAdapter.offKeyboardInput(cbs.onKeyboardInput);
                cbs.onKeyboardInput = null;
            }
            if (cbs.onKeyboardConfirm) {
                __globalAdapter.offKeyboardConfirm(cbs.onKeyboardConfirm);
                cbs.onKeyboardConfirm = null;
            }
            if (cbs.onKeyboardComplete) {
                __globalAdapter.offKeyboardComplete(cbs.onKeyboardComplete);
                cbs.onKeyboardComplete = null;
            }
        },
        _showKeyboard: function _showKeyboard() {
            var delegate = this._delegate;
            var multiline = delegate.inputMode === EditBox.InputMode.ANY;

            __globalAdapter.showKeyboard({
                defaultValue: delegate._string,
                maxLength: delegate.maxLength,
                multiple: multiline,
                confirmHold: false,
                confirmType: getKeyboardReturnType(delegate.returnType),
                success: function success(res) {},
                fail: function fail(res) {
                    cc.warn(res.errMsg);
                }
            });
        },
        _hideKeyboard: function _hideKeyboard() {
            __globalAdapter.hideKeyboard({
                success: function success(res) {},
                fail: function fail(res) {
                    cc.warn(res.errMsg);
                }
            });
        }
    });
})();