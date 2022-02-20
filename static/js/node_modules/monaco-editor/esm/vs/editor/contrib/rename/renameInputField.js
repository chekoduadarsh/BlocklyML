/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import './renameInputField.css';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { Position } from '../../common/core/position.js';
import { Range } from '../../common/core/range.js';
import { localize } from '../../../nls.js';
import { IContextKeyService, RawContextKey } from '../../../platform/contextkey/common/contextkey.js';
import { inputBackground, inputBorder, inputForeground, widgetShadow, editorWidgetBackground } from '../../../platform/theme/common/colorRegistry.js';
import { IThemeService } from '../../../platform/theme/common/themeService.js';
import { IKeybindingService } from '../../../platform/keybinding/common/keybinding.js';
import { toggleClass } from '../../../base/browser/dom.js';
export var CONTEXT_RENAME_INPUT_VISIBLE = new RawContextKey('renameInputVisible', false);
var RenameInputField = /** @class */ (function () {
    function RenameInputField(_editor, _acceptKeybindings, _themeService, _keybindingService, contextKeyService) {
        var _this = this;
        this._editor = _editor;
        this._acceptKeybindings = _acceptKeybindings;
        this._themeService = _themeService;
        this._keybindingService = _keybindingService;
        this._disposables = new DisposableStore();
        this.allowEditorOverflow = true;
        this._visibleContextKey = CONTEXT_RENAME_INPUT_VISIBLE.bindTo(contextKeyService);
        this._editor.addContentWidget(this);
        this._disposables.add(this._editor.onDidChangeConfiguration(function (e) {
            if (e.hasChanged(34 /* fontInfo */)) {
                _this._updateFont();
            }
        }));
        this._disposables.add(_themeService.onThemeChange(this._updateStyles, this));
    }
    RenameInputField.prototype.dispose = function () {
        this._disposables.dispose();
        this._editor.removeContentWidget(this);
    };
    RenameInputField.prototype.getId = function () {
        return '__renameInputWidget';
    };
    RenameInputField.prototype.getDomNode = function () {
        var _this = this;
        if (!this._domNode) {
            this._domNode = document.createElement('div');
            this._domNode.className = 'monaco-editor rename-box';
            this._input = document.createElement('input');
            this._input.className = 'rename-input';
            this._input.type = 'text';
            this._input.setAttribute('aria-label', localize('renameAriaLabel', "Rename input. Type new name and press Enter to commit."));
            this._domNode.appendChild(this._input);
            this._label = document.createElement('div');
            this._label.className = 'rename-label';
            this._domNode.appendChild(this._label);
            var updateLabel = function () {
                var _a, _b;
                var _c = _this._acceptKeybindings, accept = _c[0], preview = _c[1];
                _this._keybindingService.lookupKeybinding(accept);
                _this._label.innerText = localize('label', "{0} to Rename, {1} to Preview", (_a = _this._keybindingService.lookupKeybinding(accept)) === null || _a === void 0 ? void 0 : _a.getLabel(), (_b = _this._keybindingService.lookupKeybinding(preview)) === null || _b === void 0 ? void 0 : _b.getLabel());
            };
            updateLabel();
            this._disposables.add(this._keybindingService.onDidUpdateKeybindings(updateLabel));
            this._updateFont();
            this._updateStyles(this._themeService.getTheme());
        }
        return this._domNode;
    };
    RenameInputField.prototype._updateStyles = function (theme) {
        var _a, _b, _c, _d;
        if (!this._input || !this._domNode) {
            return;
        }
        var widgetShadowColor = theme.getColor(widgetShadow);
        this._domNode.style.backgroundColor = String((_a = theme.getColor(editorWidgetBackground)) !== null && _a !== void 0 ? _a : '');
        this._domNode.style.boxShadow = widgetShadowColor ? " 0 2px 8px " + widgetShadowColor : '';
        this._domNode.style.color = String((_b = theme.getColor(inputForeground)) !== null && _b !== void 0 ? _b : '');
        this._input.style.backgroundColor = String((_c = theme.getColor(inputBackground)) !== null && _c !== void 0 ? _c : '');
        // this._input.style.color = String(theme.getColor(inputForeground) ?? '');
        var border = theme.getColor(inputBorder);
        this._input.style.borderWidth = border ? '1px' : '0px';
        this._input.style.borderStyle = border ? 'solid' : 'none';
        this._input.style.borderColor = (_d = border === null || border === void 0 ? void 0 : border.toString()) !== null && _d !== void 0 ? _d : 'none';
    };
    RenameInputField.prototype._updateFont = function () {
        if (!this._input || !this._label) {
            return;
        }
        var fontInfo = this._editor.getOption(34 /* fontInfo */);
        this._input.style.fontFamily = fontInfo.fontFamily;
        this._input.style.fontWeight = fontInfo.fontWeight;
        this._input.style.fontSize = fontInfo.fontSize + "px";
        this._label.style.fontSize = fontInfo.fontSize * 0.8 + "px";
    };
    RenameInputField.prototype.getPosition = function () {
        if (!this._visible) {
            return null;
        }
        return {
            position: this._position,
            preference: [2 /* BELOW */, 1 /* ABOVE */]
        };
    };
    RenameInputField.prototype.acceptInput = function (wantsPreview) {
        if (this._currentAcceptInput) {
            this._currentAcceptInput(wantsPreview);
        }
    };
    RenameInputField.prototype.cancelInput = function (focusEditor) {
        if (this._currentCancelInput) {
            this._currentCancelInput(focusEditor);
        }
    };
    RenameInputField.prototype.getInput = function (where, value, selectionStart, selectionEnd, supportPreview) {
        var _this = this;
        toggleClass(this._domNode, 'preview', supportPreview);
        this._position = new Position(where.startLineNumber, where.startColumn);
        this._input.value = value;
        this._input.setAttribute('selectionStart', selectionStart.toString());
        this._input.setAttribute('selectionEnd', selectionEnd.toString());
        this._input.size = Math.max((where.endColumn - where.startColumn) * 1.1, 20);
        var disposeOnDone = new DisposableStore();
        return new Promise(function (resolve) {
            _this._currentCancelInput = function (focusEditor) {
                _this._currentAcceptInput = undefined;
                _this._currentCancelInput = undefined;
                resolve(focusEditor);
                return true;
            };
            _this._currentAcceptInput = function (wantsPreview) {
                if (_this._input.value.trim().length === 0 || _this._input.value === value) {
                    // empty or whitespace only or not changed
                    _this.cancelInput(true);
                    return;
                }
                _this._currentAcceptInput = undefined;
                _this._currentCancelInput = undefined;
                resolve({
                    newName: _this._input.value,
                    wantsPreview: supportPreview && wantsPreview
                });
            };
            var onCursorChanged = function () {
                var editorPosition = _this._editor.getPosition();
                if (!editorPosition || !Range.containsPosition(where, editorPosition)) {
                    _this.cancelInput(true);
                }
            };
            disposeOnDone.add(_this._editor.onDidChangeCursorSelection(onCursorChanged));
            disposeOnDone.add(_this._editor.onDidBlurEditorWidget(function () { return _this.cancelInput(false); }));
            _this._show();
        }).finally(function () {
            disposeOnDone.dispose();
            _this._hide();
        });
    };
    RenameInputField.prototype._show = function () {
        var _this = this;
        this._editor.revealLineInCenterIfOutsideViewport(this._position.lineNumber, 0 /* Smooth */);
        this._visible = true;
        this._visibleContextKey.set(true);
        this._editor.layoutContentWidget(this);
        setTimeout(function () {
            _this._input.focus();
            _this._input.setSelectionRange(parseInt(_this._input.getAttribute('selectionStart')), parseInt(_this._input.getAttribute('selectionEnd')));
        }, 100);
    };
    RenameInputField.prototype._hide = function () {
        this._visible = false;
        this._visibleContextKey.reset();
        this._editor.layoutContentWidget(this);
    };
    RenameInputField = __decorate([
        __param(2, IThemeService),
        __param(3, IKeybindingService),
        __param(4, IContextKeyService)
    ], RenameInputField);
    return RenameInputField;
}());
export { RenameInputField };
