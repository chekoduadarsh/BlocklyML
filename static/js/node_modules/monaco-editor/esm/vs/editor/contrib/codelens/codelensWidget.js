/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import './codelensWidget.css';
import * as dom from '../../../base/browser/dom.js';
import { renderCodicons } from '../../../base/common/codicons.js';
import { escape } from '../../../base/common/strings.js';
import { Range } from '../../common/core/range.js';
import { ModelDecorationOptions } from '../../common/model/textModel.js';
import { editorCodeLensForeground } from '../../common/view/editorColorRegistry.js';
import { editorActiveLinkForeground } from '../../../platform/theme/common/colorRegistry.js';
import { registerThemingParticipant } from '../../../platform/theme/common/themeService.js';
var CodeLensViewZone = /** @class */ (function () {
    function CodeLensViewZone(afterLineNumber, onHeight) {
        this.afterLineNumber = afterLineNumber;
        this._onHeight = onHeight;
        this.heightInLines = 1;
        this.suppressMouseDown = true;
        this.domNode = document.createElement('div');
    }
    CodeLensViewZone.prototype.onComputedHeight = function (height) {
        if (this._lastHeight === undefined) {
            this._lastHeight = height;
        }
        else if (this._lastHeight !== height) {
            this._lastHeight = height;
            this._onHeight();
        }
    };
    return CodeLensViewZone;
}());
var CodeLensContentWidget = /** @class */ (function () {
    function CodeLensContentWidget(editor, className, line) {
        // Editor.IContentWidget.allowEditorOverflow
        this.allowEditorOverflow = false;
        this.suppressMouseDown = true;
        this._commands = new Map();
        this._isEmpty = true;
        this._editor = editor;
        this._id = "codelens.widget-" + (CodeLensContentWidget._idPool++);
        this.updatePosition(line);
        this._domNode = document.createElement('span');
        this._domNode.className = "codelens-decoration " + className;
    }
    CodeLensContentWidget.prototype.withCommands = function (lenses, animate) {
        this._commands.clear();
        var innerHtml = '';
        var hasSymbol = false;
        for (var i = 0; i < lenses.length; i++) {
            var lens = lenses[i];
            if (!lens) {
                continue;
            }
            hasSymbol = true;
            if (lens.command) {
                var title = renderCodicons(escape(lens.command.title));
                if (lens.command.id) {
                    innerHtml += "<a id=" + i + ">" + title + "</a>";
                    this._commands.set(String(i), lens.command);
                }
                else {
                    innerHtml += "<span>" + title + "</span>";
                }
                if (i + 1 < lenses.length) {
                    innerHtml += '<span>&#160;|&#160;</span>';
                }
            }
        }
        if (!hasSymbol) {
            // symbols but no commands
            this._domNode.innerHTML = '<span>no commands</span>';
        }
        else {
            // symbols and commands
            if (!innerHtml) {
                innerHtml = '&#160;';
            }
            this._domNode.innerHTML = innerHtml;
            if (this._isEmpty && animate) {
                dom.addClass(this._domNode, 'fadein');
            }
            this._isEmpty = false;
        }
    };
    CodeLensContentWidget.prototype.getCommand = function (link) {
        return link.parentElement === this._domNode
            ? this._commands.get(link.id)
            : undefined;
    };
    CodeLensContentWidget.prototype.getId = function () {
        return this._id;
    };
    CodeLensContentWidget.prototype.getDomNode = function () {
        return this._domNode;
    };
    CodeLensContentWidget.prototype.updatePosition = function (line) {
        var column = this._editor.getModel().getLineFirstNonWhitespaceColumn(line);
        this._widgetPosition = {
            position: { lineNumber: line, column: column },
            preference: [1 /* ABOVE */]
        };
    };
    CodeLensContentWidget.prototype.getPosition = function () {
        return this._widgetPosition || null;
    };
    CodeLensContentWidget._idPool = 0;
    return CodeLensContentWidget;
}());
var CodeLensHelper = /** @class */ (function () {
    function CodeLensHelper() {
        this._removeDecorations = [];
        this._addDecorations = [];
        this._addDecorationsCallbacks = [];
    }
    CodeLensHelper.prototype.addDecoration = function (decoration, callback) {
        this._addDecorations.push(decoration);
        this._addDecorationsCallbacks.push(callback);
    };
    CodeLensHelper.prototype.removeDecoration = function (decorationId) {
        this._removeDecorations.push(decorationId);
    };
    CodeLensHelper.prototype.commit = function (changeAccessor) {
        var resultingDecorations = changeAccessor.deltaDecorations(this._removeDecorations, this._addDecorations);
        for (var i = 0, len = resultingDecorations.length; i < len; i++) {
            this._addDecorationsCallbacks[i](resultingDecorations[i]);
        }
    };
    return CodeLensHelper;
}());
export { CodeLensHelper };
var CodeLensWidget = /** @class */ (function () {
    function CodeLensWidget(data, editor, className, helper, viewZoneChangeAccessor, updateCallback) {
        var _this = this;
        this._isDisposed = false;
        this._editor = editor;
        this._className = className;
        this._data = data;
        // create combined range, track all ranges with decorations,
        // check if there is already something to render
        this._decorationIds = [];
        var range;
        var lenses = [];
        this._data.forEach(function (codeLensData, i) {
            if (codeLensData.symbol.command) {
                lenses.push(codeLensData.symbol);
            }
            helper.addDecoration({
                range: codeLensData.symbol.range,
                options: ModelDecorationOptions.EMPTY
            }, function (id) { return _this._decorationIds[i] = id; });
            // the range contains all lenses on this line
            if (!range) {
                range = Range.lift(codeLensData.symbol.range);
            }
            else {
                range = Range.plusRange(range, codeLensData.symbol.range);
            }
        });
        this._viewZone = new CodeLensViewZone(range.startLineNumber - 1, updateCallback);
        this._viewZoneId = viewZoneChangeAccessor.addZone(this._viewZone);
        if (lenses.length > 0) {
            this._createContentWidgetIfNecessary();
            this._contentWidget.withCommands(lenses, false);
        }
    }
    CodeLensWidget.prototype._createContentWidgetIfNecessary = function () {
        if (!this._contentWidget) {
            this._contentWidget = new CodeLensContentWidget(this._editor, this._className, this._viewZone.afterLineNumber + 1);
            this._editor.addContentWidget(this._contentWidget);
        }
    };
    CodeLensWidget.prototype.dispose = function (helper, viewZoneChangeAccessor) {
        this._decorationIds.forEach(helper.removeDecoration, helper);
        this._decorationIds = [];
        if (viewZoneChangeAccessor) {
            viewZoneChangeAccessor.removeZone(this._viewZoneId);
        }
        if (this._contentWidget) {
            this._editor.removeContentWidget(this._contentWidget);
            this._contentWidget = undefined;
        }
        this._isDisposed = true;
    };
    CodeLensWidget.prototype.isDisposed = function () {
        return this._isDisposed;
    };
    CodeLensWidget.prototype.isValid = function () {
        var _this = this;
        return this._decorationIds.some(function (id, i) {
            var range = _this._editor.getModel().getDecorationRange(id);
            var symbol = _this._data[i].symbol;
            return !!(range && Range.isEmpty(symbol.range) === range.isEmpty());
        });
    };
    CodeLensWidget.prototype.updateCodeLensSymbols = function (data, helper) {
        var _this = this;
        this._decorationIds.forEach(helper.removeDecoration, helper);
        this._decorationIds = [];
        this._data = data;
        this._data.forEach(function (codeLensData, i) {
            helper.addDecoration({
                range: codeLensData.symbol.range,
                options: ModelDecorationOptions.EMPTY
            }, function (id) { return _this._decorationIds[i] = id; });
        });
    };
    CodeLensWidget.prototype.computeIfNecessary = function (model) {
        if (!this._viewZone.domNode.hasAttribute('monaco-visible-view-zone')) {
            return null;
        }
        // Read editor current state
        for (var i = 0; i < this._decorationIds.length; i++) {
            var range = model.getDecorationRange(this._decorationIds[i]);
            if (range) {
                this._data[i].symbol.range = range;
            }
        }
        return this._data;
    };
    CodeLensWidget.prototype.updateCommands = function (symbols) {
        this._createContentWidgetIfNecessary();
        this._contentWidget.withCommands(symbols, true);
        for (var i = 0; i < this._data.length; i++) {
            var resolved = symbols[i];
            if (resolved) {
                var symbol = this._data[i].symbol;
                symbol.command = resolved.command || symbol.command;
            }
        }
    };
    CodeLensWidget.prototype.getCommand = function (link) {
        var _a;
        return (_a = this._contentWidget) === null || _a === void 0 ? void 0 : _a.getCommand(link);
    };
    CodeLensWidget.prototype.getLineNumber = function () {
        var range = this._editor.getModel().getDecorationRange(this._decorationIds[0]);
        if (range) {
            return range.startLineNumber;
        }
        return -1;
    };
    CodeLensWidget.prototype.update = function (viewZoneChangeAccessor) {
        if (this.isValid()) {
            var range = this._editor.getModel().getDecorationRange(this._decorationIds[0]);
            if (range) {
                this._viewZone.afterLineNumber = range.startLineNumber - 1;
                viewZoneChangeAccessor.layoutZone(this._viewZoneId);
                if (this._contentWidget) {
                    this._contentWidget.updatePosition(range.startLineNumber);
                    this._editor.layoutContentWidget(this._contentWidget);
                }
            }
        }
    };
    return CodeLensWidget;
}());
export { CodeLensWidget };
registerThemingParticipant(function (theme, collector) {
    var codeLensForeground = theme.getColor(editorCodeLensForeground);
    if (codeLensForeground) {
        collector.addRule(".monaco-editor .codelens-decoration { color: " + codeLensForeground + "; }");
        collector.addRule(".monaco-editor .codelens-decoration .codicon { color: " + codeLensForeground + "; }");
    }
    var activeLinkForeground = theme.getColor(editorActiveLinkForeground);
    if (activeLinkForeground) {
        collector.addRule(".monaco-editor .codelens-decoration > a:hover { color: " + activeLinkForeground + " !important; }");
        collector.addRule(".monaco-editor .codelens-decoration > a:hover .codicon { color: " + activeLinkForeground + " !important; }");
    }
});
