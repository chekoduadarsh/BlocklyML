/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as nls from '../../../nls.js';
import { Disposable } from '../../../base/common/lifecycle.js';
import { EditorAction, registerEditorAction, registerEditorContribution } from '../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
var CursorState = /** @class */ (function () {
    function CursorState(selections) {
        this.selections = selections;
    }
    CursorState.prototype.equals = function (other) {
        var thisLen = this.selections.length;
        var otherLen = other.selections.length;
        if (thisLen !== otherLen) {
            return false;
        }
        for (var i = 0; i < thisLen; i++) {
            if (!this.selections[i].equalsSelection(other.selections[i])) {
                return false;
            }
        }
        return true;
    };
    return CursorState;
}());
var StackElement = /** @class */ (function () {
    function StackElement(cursorState, scrollTop, scrollLeft) {
        this.cursorState = cursorState;
        this.scrollTop = scrollTop;
        this.scrollLeft = scrollLeft;
    }
    return StackElement;
}());
var CursorUndoRedoController = /** @class */ (function (_super) {
    __extends(CursorUndoRedoController, _super);
    function CursorUndoRedoController(editor) {
        var _this = _super.call(this) || this;
        _this._editor = editor;
        _this._isCursorUndoRedo = false;
        _this._undoStack = [];
        _this._redoStack = [];
        _this._register(editor.onDidChangeModel(function (e) {
            _this._undoStack = [];
            _this._redoStack = [];
        }));
        _this._register(editor.onDidChangeModelContent(function (e) {
            _this._undoStack = [];
            _this._redoStack = [];
        }));
        _this._register(editor.onDidChangeCursorSelection(function (e) {
            if (_this._isCursorUndoRedo) {
                return;
            }
            if (!e.oldSelections) {
                return;
            }
            if (e.oldModelVersionId !== e.modelVersionId) {
                return;
            }
            var prevState = new CursorState(e.oldSelections);
            var isEqualToLastUndoStack = (_this._undoStack.length > 0 && _this._undoStack[_this._undoStack.length - 1].cursorState.equals(prevState));
            if (!isEqualToLastUndoStack) {
                _this._undoStack.push(new StackElement(prevState, editor.getScrollTop(), editor.getScrollLeft()));
                _this._redoStack = [];
                if (_this._undoStack.length > 50) {
                    // keep the cursor undo stack bounded
                    _this._undoStack.shift();
                }
            }
        }));
        return _this;
    }
    CursorUndoRedoController.get = function (editor) {
        return editor.getContribution(CursorUndoRedoController.ID);
    };
    CursorUndoRedoController.prototype.cursorUndo = function () {
        if (!this._editor.hasModel() || this._undoStack.length === 0) {
            return;
        }
        this._redoStack.push(new StackElement(new CursorState(this._editor.getSelections()), this._editor.getScrollTop(), this._editor.getScrollLeft()));
        this._applyState(this._undoStack.pop());
    };
    CursorUndoRedoController.prototype.cursorRedo = function () {
        if (!this._editor.hasModel() || this._redoStack.length === 0) {
            return;
        }
        this._undoStack.push(new StackElement(new CursorState(this._editor.getSelections()), this._editor.getScrollTop(), this._editor.getScrollLeft()));
        this._applyState(this._redoStack.pop());
    };
    CursorUndoRedoController.prototype._applyState = function (stackElement) {
        this._isCursorUndoRedo = true;
        this._editor.setSelections(stackElement.cursorState.selections);
        this._editor.setScrollPosition({
            scrollTop: stackElement.scrollTop,
            scrollLeft: stackElement.scrollLeft
        });
        this._isCursorUndoRedo = false;
    };
    CursorUndoRedoController.ID = 'editor.contrib.cursorUndoRedoController';
    return CursorUndoRedoController;
}(Disposable));
export { CursorUndoRedoController };
var CursorUndo = /** @class */ (function (_super) {
    __extends(CursorUndo, _super);
    function CursorUndo() {
        return _super.call(this, {
            id: 'cursorUndo',
            label: nls.localize('cursor.undo', "Cursor Undo"),
            alias: 'Cursor Undo',
            precondition: undefined,
            kbOpts: {
                kbExpr: EditorContextKeys.textInputFocus,
                primary: 2048 /* CtrlCmd */ | 51 /* KEY_U */,
                weight: 100 /* EditorContrib */
            }
        }) || this;
    }
    CursorUndo.prototype.run = function (accessor, editor, args) {
        CursorUndoRedoController.get(editor).cursorUndo();
    };
    return CursorUndo;
}(EditorAction));
export { CursorUndo };
var CursorRedo = /** @class */ (function (_super) {
    __extends(CursorRedo, _super);
    function CursorRedo() {
        return _super.call(this, {
            id: 'cursorRedo',
            label: nls.localize('cursor.redo', "Cursor Redo"),
            alias: 'Cursor Redo',
            precondition: undefined
        }) || this;
    }
    CursorRedo.prototype.run = function (accessor, editor, args) {
        CursorUndoRedoController.get(editor).cursorRedo();
    };
    return CursorRedo;
}(EditorAction));
export { CursorRedo };
registerEditorContribution(CursorUndoRedoController.ID, CursorUndoRedoController);
registerEditorAction(CursorUndo);
registerEditorAction(CursorRedo);
