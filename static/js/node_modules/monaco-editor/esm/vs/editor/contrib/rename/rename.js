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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as nls from '../../../nls.js';
import { illegalArgument, onUnexpectedError } from '../../../base/common/errors.js';
import { ContextKeyExpr } from '../../../platform/contextkey/common/contextkey.js';
import { IEditorProgressService } from '../../../platform/progress/common/progress.js';
import { registerEditorAction, registerEditorContribution, EditorAction, EditorCommand, registerEditorCommand, registerDefaultLanguageCommand } from '../../browser/editorExtensions.js';
import { EditorContextKeys } from '../../common/editorContextKeys.js';
import { RenameInputField, CONTEXT_RENAME_INPUT_VISIBLE } from './renameInputField.js';
import { RenameProviderRegistry } from '../../common/modes.js';
import { Position } from '../../common/core/position.js';
import { alert } from '../../../base/browser/ui/aria/aria.js';
import { Range } from '../../common/core/range.js';
import { MessageController } from '../message/messageController.js';
import { EditorStateCancellationTokenSource } from '../../browser/core/editorState.js';
import { INotificationService } from '../../../platform/notification/common/notification.js';
import { IBulkEditService } from '../../browser/services/bulkEditService.js';
import { URI } from '../../../base/common/uri.js';
import { ICodeEditorService } from '../../browser/services/codeEditorService.js';
import { CancellationToken, CancellationTokenSource } from '../../../base/common/cancellation.js';
import { DisposableStore } from '../../../base/common/lifecycle.js';
import { IdleValue, raceCancellation } from '../../../base/common/async.js';
import { withNullAsUndefined } from '../../../base/common/types.js';
import { ILogService } from '../../../platform/log/common/log.js';
import { IInstantiationService } from '../../../platform/instantiation/common/instantiation.js';
import { Registry } from '../../../platform/registry/common/platform.js';
import { Extensions } from '../../../platform/configuration/common/configurationRegistry.js';
import { ITextResourceConfigurationService } from '../../common/services/textResourceConfigurationService.js';
var RenameSkeleton = /** @class */ (function () {
    function RenameSkeleton(model, position) {
        this.model = model;
        this.position = position;
        this._providers = RenameProviderRegistry.ordered(model);
    }
    RenameSkeleton.prototype.hasProvider = function () {
        return this._providers.length > 0;
    };
    RenameSkeleton.prototype.resolveRenameLocation = function (token) {
        return __awaiter(this, void 0, void 0, function () {
            var firstProvider, res, _a, word;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        firstProvider = this._providers[0];
                        if (!firstProvider) {
                            return [2 /*return*/, undefined];
                        }
                        if (!firstProvider.resolveRenameLocation) return [3 /*break*/, 2];
                        _a = withNullAsUndefined;
                        return [4 /*yield*/, firstProvider.resolveRenameLocation(this.model, this.position, token)];
                    case 1:
                        res = _a.apply(void 0, [_b.sent()]);
                        _b.label = 2;
                    case 2:
                        if (!res) {
                            word = this.model.getWordAtPosition(this.position);
                            if (word) {
                                return [2 /*return*/, {
                                        range: new Range(this.position.lineNumber, word.startColumn, this.position.lineNumber, word.endColumn),
                                        text: word.word
                                    }];
                            }
                        }
                        return [2 /*return*/, res];
                }
            });
        });
    };
    RenameSkeleton.prototype.provideRenameEdits = function (newName, i, rejects, token) {
        return __awaiter(this, void 0, void 0, function () {
            var provider, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        provider = this._providers[i];
                        if (!provider) {
                            return [2 /*return*/, {
                                    edits: [],
                                    rejectReason: rejects.join('\n')
                                }];
                        }
                        return [4 /*yield*/, provider.provideRenameEdits(this.model, this.position, newName, token)];
                    case 1:
                        result = _a.sent();
                        if (!result) {
                            return [2 /*return*/, this.provideRenameEdits(newName, i + 1, rejects.concat(nls.localize('no result', "No result.")), token)];
                        }
                        else if (result.rejectReason) {
                            return [2 /*return*/, this.provideRenameEdits(newName, i + 1, rejects.concat(result.rejectReason), token)];
                        }
                        return [2 /*return*/, result];
                }
            });
        });
    };
    return RenameSkeleton;
}());
export function rename(model, position, newName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new RenameSkeleton(model, position).provideRenameEdits(newName, 0, [], CancellationToken.None)];
        });
    });
}
// ---  register actions and commands
var RenameController = /** @class */ (function () {
    function RenameController(editor, _instaService, _notificationService, _bulkEditService, _progressService, _logService, _configService) {
        var _this = this;
        this.editor = editor;
        this._instaService = _instaService;
        this._notificationService = _notificationService;
        this._bulkEditService = _bulkEditService;
        this._progressService = _progressService;
        this._logService = _logService;
        this._configService = _configService;
        this._dispoableStore = new DisposableStore();
        this._cts = new CancellationTokenSource();
        this._renameInputField = this._dispoableStore.add(new IdleValue(function () { return _this._dispoableStore.add(_this._instaService.createInstance(RenameInputField, _this.editor, ['acceptRenameInput', 'acceptRenameInputWithPreview'])); }));
    }
    RenameController.get = function (editor) {
        return editor.getContribution(RenameController.ID);
    };
    RenameController.prototype.dispose = function () {
        this._dispoableStore.dispose();
        this._cts.dispose(true);
    };
    RenameController.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            var position, skeleton, loc, resolveLocationOperation, e_1, selection, selectionStart, selectionEnd, supportPreview, inputFieldResult, renameOperation;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this._cts.dispose(true);
                        if (!this.editor.hasModel()) {
                            return [2 /*return*/, undefined];
                        }
                        position = this.editor.getPosition();
                        skeleton = new RenameSkeleton(this.editor.getModel(), position);
                        if (!skeleton.hasProvider()) {
                            return [2 /*return*/, undefined];
                        }
                        this._cts = new EditorStateCancellationTokenSource(this.editor, 4 /* Position */ | 1 /* Value */);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        resolveLocationOperation = skeleton.resolveRenameLocation(this._cts.token);
                        this._progressService.showWhile(resolveLocationOperation, 250);
                        return [4 /*yield*/, resolveLocationOperation];
                    case 2:
                        loc = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        MessageController.get(this.editor).showMessage(e_1 || nls.localize('resolveRenameLocationFailed', "An unknown error occurred while resolving rename location"), position);
                        return [2 /*return*/, undefined];
                    case 4:
                        if (!loc) {
                            return [2 /*return*/, undefined];
                        }
                        if (loc.rejectReason) {
                            MessageController.get(this.editor).showMessage(loc.rejectReason, position);
                            return [2 /*return*/, undefined];
                        }
                        if (this._cts.token.isCancellationRequested) {
                            return [2 /*return*/, undefined];
                        }
                        selection = this.editor.getSelection();
                        selectionStart = 0;
                        selectionEnd = loc.text.length;
                        if (!Range.isEmpty(selection) && !Range.spansMultipleLines(selection) && Range.containsRange(loc.range, selection)) {
                            selectionStart = Math.max(0, selection.startColumn - loc.range.startColumn);
                            selectionEnd = Math.min(loc.range.endColumn, selection.endColumn) - loc.range.startColumn;
                        }
                        supportPreview = this._bulkEditService.hasPreviewHandler() && this._configService.getValue(this.editor.getModel().uri, 'editor.rename.enablePreview');
                        return [4 /*yield*/, this._renameInputField.getValue().getInput(loc.range, loc.text, selectionStart, selectionEnd, supportPreview)];
                    case 5:
                        inputFieldResult = _a.sent();
                        // no result, only hint to focus the editor or not
                        if (typeof inputFieldResult === 'boolean') {
                            if (inputFieldResult) {
                                this.editor.focus();
                            }
                            return [2 /*return*/, undefined];
                        }
                        this.editor.focus();
                        renameOperation = raceCancellation(skeleton.provideRenameEdits(inputFieldResult.newName, 0, [], this._cts.token), this._cts.token).then(function (renameResult) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                if (!renameResult || !this.editor.hasModel()) {
                                    return [2 /*return*/];
                                }
                                if (renameResult.rejectReason) {
                                    this._notificationService.info(renameResult.rejectReason);
                                    return [2 /*return*/];
                                }
                                this._bulkEditService.apply(renameResult, {
                                    editor: this.editor,
                                    showPreview: inputFieldResult.wantsPreview,
                                    label: nls.localize('label', "Renaming '{0}'", loc === null || loc === void 0 ? void 0 : loc.text)
                                }).then(function (result) {
                                    if (result.ariaSummary) {
                                        alert(nls.localize('aria', "Successfully renamed '{0}' to '{1}'. Summary: {2}", loc.text, inputFieldResult.newName, result.ariaSummary));
                                    }
                                }).catch(function (err) {
                                    _this._notificationService.error(nls.localize('rename.failedApply', "Rename failed to apply edits"));
                                    _this._logService.error(err);
                                });
                                return [2 /*return*/];
                            });
                        }); }, function (err) {
                            _this._notificationService.error(nls.localize('rename.failed', "Rename failed to compute edits"));
                            _this._logService.error(err);
                        });
                        this._progressService.showWhile(renameOperation, 250);
                        return [2 /*return*/, renameOperation];
                }
            });
        });
    };
    RenameController.prototype.acceptRenameInput = function (wantsPreview) {
        this._renameInputField.getValue().acceptInput(wantsPreview);
    };
    RenameController.prototype.cancelRenameInput = function () {
        this._renameInputField.getValue().cancelInput(true);
    };
    RenameController.ID = 'editor.contrib.renameController';
    RenameController = __decorate([
        __param(1, IInstantiationService),
        __param(2, INotificationService),
        __param(3, IBulkEditService),
        __param(4, IEditorProgressService),
        __param(5, ILogService),
        __param(6, ITextResourceConfigurationService)
    ], RenameController);
    return RenameController;
}());
// ---- action implementation
var RenameAction = /** @class */ (function (_super) {
    __extends(RenameAction, _super);
    function RenameAction() {
        return _super.call(this, {
            id: 'editor.action.rename',
            label: nls.localize('rename.label', "Rename Symbol"),
            alias: 'Rename Symbol',
            precondition: ContextKeyExpr.and(EditorContextKeys.writable, EditorContextKeys.hasRenameProvider),
            kbOpts: {
                kbExpr: EditorContextKeys.editorTextFocus,
                primary: 60 /* F2 */,
                weight: 100 /* EditorContrib */
            },
            contextMenuOpts: {
                group: '1_modification',
                order: 1.1
            }
        }) || this;
    }
    RenameAction.prototype.runCommand = function (accessor, args) {
        var _this = this;
        var editorService = accessor.get(ICodeEditorService);
        var _a = Array.isArray(args) && args || [undefined, undefined], uri = _a[0], pos = _a[1];
        if (URI.isUri(uri) && Position.isIPosition(pos)) {
            return editorService.openCodeEditor({ resource: uri }, editorService.getActiveCodeEditor()).then(function (editor) {
                if (!editor) {
                    return;
                }
                editor.setPosition(pos);
                editor.invokeWithinContext(function (accessor) {
                    _this.reportTelemetry(accessor, editor);
                    return _this.run(accessor, editor);
                });
            }, onUnexpectedError);
        }
        return _super.prototype.runCommand.call(this, accessor, args);
    };
    RenameAction.prototype.run = function (accessor, editor) {
        var controller = RenameController.get(editor);
        if (controller) {
            return controller.run();
        }
        return Promise.resolve();
    };
    return RenameAction;
}(EditorAction));
export { RenameAction };
registerEditorContribution(RenameController.ID, RenameController);
registerEditorAction(RenameAction);
var RenameCommand = EditorCommand.bindToContribution(RenameController.get);
registerEditorCommand(new RenameCommand({
    id: 'acceptRenameInput',
    precondition: CONTEXT_RENAME_INPUT_VISIBLE,
    handler: function (x) { return x.acceptRenameInput(false); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 99,
        kbExpr: EditorContextKeys.focus,
        primary: 3 /* Enter */
    }
}));
registerEditorCommand(new RenameCommand({
    id: 'acceptRenameInputWithPreview',
    precondition: ContextKeyExpr.and(CONTEXT_RENAME_INPUT_VISIBLE, ContextKeyExpr.has('config.editor.rename.enablePreview')),
    handler: function (x) { return x.acceptRenameInput(true); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 99,
        kbExpr: EditorContextKeys.focus,
        primary: 1024 /* Shift */ + 3 /* Enter */
    }
}));
registerEditorCommand(new RenameCommand({
    id: 'cancelRenameInput',
    precondition: CONTEXT_RENAME_INPUT_VISIBLE,
    handler: function (x) { return x.cancelRenameInput(); },
    kbOpts: {
        weight: 100 /* EditorContrib */ + 99,
        kbExpr: EditorContextKeys.focus,
        primary: 9 /* Escape */,
        secondary: [1024 /* Shift */ | 9 /* Escape */]
    }
}));
// ---- api bridge command
registerDefaultLanguageCommand('_executeDocumentRenameProvider', function (model, position, args) {
    var newName = args.newName;
    if (typeof newName !== 'string') {
        throw illegalArgument('newName');
    }
    return rename(model, position, newName);
});
//todo@joh use editor options world
Registry.as(Extensions.Configuration).registerConfiguration({
    id: 'editor',
    properties: {
        'editor.rename.enablePreview': {
            scope: 5 /* LANGUAGE_OVERRIDABLE */,
            description: nls.localize('enablePreview', "Enable/disable the ability to preview changes before renaming"),
            default: true,
            type: 'boolean'
        }
    }
});
