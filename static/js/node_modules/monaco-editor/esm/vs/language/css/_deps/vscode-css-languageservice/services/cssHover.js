/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as nodes from '../parser/cssNodes.js';
import * as languageFacts from '../languageFacts/facts.js';
import { selectorToMarkedString, simpleSelectorToMarkedString } from './selectorPrinting.js';
import { startsWith } from '../utils/strings.js';
import { Range, MarkupKind } from '../cssLanguageTypes.js';
import { isDefined } from '../utils/objects.js';
var CSSHover = /** @class */ (function () {
    function CSSHover(clientCapabilities) {
        this.clientCapabilities = clientCapabilities;
    }
    CSSHover.prototype.doHover = function (document, position, stylesheet) {
        function getRange(node) {
            return Range.create(document.positionAt(node.offset), document.positionAt(node.end));
        }
        var offset = document.offsetAt(position);
        var nodepath = nodes.getNodePath(stylesheet, offset);
        /**
         * nodepath is top-down
         * Build up the hover by appending inner node's information
         */
        var hover = null;
        for (var i = 0; i < nodepath.length; i++) {
            var node = nodepath[i];
            if (node instanceof nodes.Selector) {
                hover = {
                    contents: selectorToMarkedString(node),
                    range: getRange(node)
                };
                break;
            }
            if (node instanceof nodes.SimpleSelector) {
                /**
                 * Some sass specific at rules such as `@at-root` are parsed as `SimpleSelector`
                 */
                if (!startsWith(node.getText(), '@')) {
                    hover = {
                        contents: simpleSelectorToMarkedString(node),
                        range: getRange(node)
                    };
                }
                break;
            }
            if (node instanceof nodes.Declaration) {
                var propertyName = node.getFullPropertyName();
                var entry = languageFacts.cssDataManager.getProperty(propertyName);
                if (entry) {
                    hover = {
                        contents: languageFacts.getEntryDescription(entry, this.doesSupportMarkdown()),
                        range: getRange(node)
                    };
                }
                continue;
            }
            if (node instanceof nodes.UnknownAtRule) {
                var atRuleName = node.getText();
                var entry = languageFacts.cssDataManager.getAtDirective(atRuleName);
                if (entry) {
                    hover = {
                        contents: languageFacts.getEntryDescription(entry, this.doesSupportMarkdown()),
                        range: getRange(node)
                    };
                }
                continue;
            }
            if (node instanceof nodes.Node && node.type === nodes.NodeType.PseudoSelector) {
                var selectorName = node.getText();
                var entry = selectorName.slice(0, 2) === '::'
                    ? languageFacts.cssDataManager.getPseudoElement(selectorName)
                    : languageFacts.cssDataManager.getPseudoClass(selectorName);
                if (entry) {
                    hover = {
                        contents: languageFacts.getEntryDescription(entry, this.doesSupportMarkdown()),
                        range: getRange(node)
                    };
                }
                continue;
            }
        }
        if (hover) {
            hover.contents = this.convertContents(hover.contents);
        }
        return hover;
    };
    CSSHover.prototype.convertContents = function (contents) {
        if (!this.doesSupportMarkdown()) {
            if (typeof contents === 'string') {
                return contents;
            }
            // MarkupContent
            else if ('kind' in contents) {
                return {
                    kind: 'plaintext',
                    value: contents.value
                };
            }
            // MarkedString[]
            else if (Array.isArray(contents)) {
                return contents.map(function (c) {
                    return typeof c === 'string' ? c : c.value;
                });
            }
            // MarkedString
            else {
                return contents.value;
            }
        }
        return contents;
    };
    CSSHover.prototype.doesSupportMarkdown = function () {
        if (!isDefined(this.supportsMarkdown)) {
            if (!isDefined(this.clientCapabilities)) {
                this.supportsMarkdown = true;
                return this.supportsMarkdown;
            }
            var hover = this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.hover;
            this.supportsMarkdown = hover && hover.contentFormat && Array.isArray(hover.contentFormat) && hover.contentFormat.indexOf(MarkupKind.Markdown) !== -1;
        }
        return this.supportsMarkdown;
    };
    return CSSHover;
}());
export { CSSHover };
