/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { createScanner } from '../parser/htmlScanner.js';
import { MarkupKind } from './../_deps/vscode-languageserver-types/main.js';
import { TokenType } from '../htmlLanguageTypes.js';
import { getAllDataProviders } from '../languageFacts/builtinDataProviders.js';
import { isDefined } from '../utils/object.js';
import { generateDocumentation } from '../languageFacts/dataProvider.js';
var HTMLHover = /** @class */ (function () {
    function HTMLHover(clientCapabilities) {
        this.clientCapabilities = clientCapabilities;
    }
    HTMLHover.prototype.doHover = function (document, position, htmlDocument) {
        var convertContents = this.convertContents.bind(this);
        var doesSupportMarkdown = this.doesSupportMarkdown();
        var offset = document.offsetAt(position);
        var node = htmlDocument.findNodeAt(offset);
        if (!node || !node.tag) {
            return null;
        }
        var dataProviders = getAllDataProviders().filter(function (p) { return p.isApplicable(document.languageId); });
        function getTagHover(currTag, range, open) {
            currTag = currTag.toLowerCase();
            var _loop_1 = function (provider) {
                var hover = null;
                provider.provideTags().forEach(function (tag) {
                    if (tag.name.toLowerCase() === currTag.toLowerCase()) {
                        var tagLabel = open ? '<' + currTag + '>' : '</' + currTag + '>';
                        var markupContent = generateDocumentation(tag, doesSupportMarkdown);
                        markupContent.value = '```html\n' + tagLabel + '\n```\n' + markupContent.value;
                        hover = { contents: markupContent, range: range };
                    }
                });
                if (hover) {
                    hover.contents = convertContents(hover.contents);
                    return { value: hover };
                }
            };
            for (var _i = 0, dataProviders_1 = dataProviders; _i < dataProviders_1.length; _i++) {
                var provider = dataProviders_1[_i];
                var state_1 = _loop_1(provider);
                if (typeof state_1 === "object")
                    return state_1.value;
            }
            return null;
        }
        function getAttrHover(currTag, currAttr, range) {
            currTag = currTag.toLowerCase();
            var _loop_2 = function (provider) {
                var hover = null;
                provider.provideAttributes(currTag).forEach(function (attr) {
                    if (currAttr === attr.name && attr.description) {
                        hover = { contents: generateDocumentation(attr, doesSupportMarkdown), range: range };
                    }
                });
                if (hover) {
                    hover.contents = convertContents(hover.contents);
                    return { value: hover };
                }
            };
            for (var _i = 0, dataProviders_2 = dataProviders; _i < dataProviders_2.length; _i++) {
                var provider = dataProviders_2[_i];
                var state_2 = _loop_2(provider);
                if (typeof state_2 === "object")
                    return state_2.value;
            }
            return null;
        }
        function getAttrValueHover(currTag, currAttr, currAttrValue, range) {
            currTag = currTag.toLowerCase();
            var _loop_3 = function (provider) {
                var hover = null;
                provider.provideValues(currTag, currAttr).forEach(function (attrValue) {
                    if (currAttrValue === attrValue.name && attrValue.description) {
                        hover = { contents: generateDocumentation(attrValue, doesSupportMarkdown), range: range };
                    }
                });
                if (hover) {
                    hover.contents = convertContents(hover.contents);
                    return { value: hover };
                }
            };
            for (var _i = 0, dataProviders_3 = dataProviders; _i < dataProviders_3.length; _i++) {
                var provider = dataProviders_3[_i];
                var state_3 = _loop_3(provider);
                if (typeof state_3 === "object")
                    return state_3.value;
            }
            return null;
        }
        function getTagNameRange(tokenType, startOffset) {
            var scanner = createScanner(document.getText(), startOffset);
            var token = scanner.scan();
            while (token !== TokenType.EOS && (scanner.getTokenEnd() < offset || scanner.getTokenEnd() === offset && token !== tokenType)) {
                token = scanner.scan();
            }
            if (token === tokenType && offset <= scanner.getTokenEnd()) {
                return { start: document.positionAt(scanner.getTokenOffset()), end: document.positionAt(scanner.getTokenEnd()) };
            }
            return null;
        }
        if (node.endTagStart && offset >= node.endTagStart) {
            var tagRange_1 = getTagNameRange(TokenType.EndTag, node.endTagStart);
            if (tagRange_1) {
                return getTagHover(node.tag, tagRange_1, false);
            }
            return null;
        }
        var tagRange = getTagNameRange(TokenType.StartTag, node.start);
        if (tagRange) {
            return getTagHover(node.tag, tagRange, true);
        }
        var attrRange = getTagNameRange(TokenType.AttributeName, node.start);
        if (attrRange) {
            var tag = node.tag;
            var attr = document.getText(attrRange);
            return getAttrHover(tag, attr, attrRange);
        }
        function scanAttrAndAttrValue(nodeStart, attrValueStart) {
            var scanner = createScanner(document.getText(), nodeStart);
            var token = scanner.scan();
            var prevAttr = undefined;
            while (token !== TokenType.EOS && (scanner.getTokenEnd() <= attrValueStart)) {
                token = scanner.scan();
                if (token === TokenType.AttributeName) {
                    prevAttr = scanner.getTokenText();
                }
            }
            return prevAttr;
        }
        var attrValueRange = getTagNameRange(TokenType.AttributeValue, node.start);
        if (attrValueRange) {
            var tag = node.tag;
            var attrValue = trimQuotes(document.getText(attrValueRange));
            var matchAttr = scanAttrAndAttrValue(node.start, document.offsetAt(attrValueRange.start));
            if (matchAttr) {
                return getAttrValueHover(tag, matchAttr, attrValue, attrValueRange);
            }
        }
        return null;
    };
    HTMLHover.prototype.convertContents = function (contents) {
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
                contents.map(function (c) {
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
    HTMLHover.prototype.doesSupportMarkdown = function () {
        if (!isDefined(this.supportsMarkdown)) {
            if (!isDefined(this.clientCapabilities)) {
                this.supportsMarkdown = true;
                return this.supportsMarkdown;
            }
            var hover = this.clientCapabilities && this.clientCapabilities.textDocument && this.clientCapabilities.textDocument.hover;
            this.supportsMarkdown = hover && hover.contentFormat && Array.isArray(hover.contentFormat) && hover.contentFormat.indexOf(MarkupKind.Markdown) !== -1;
        }
        return this.supportsMarkdown;
    };
    return HTMLHover;
}());
export { HTMLHover };
function trimQuotes(s) {
    if (s.length <= 1) {
        return s.replace(/['"]/, '');
    }
    if (s[0] === "'" || s[0] === "\"") {
        s = s.slice(1);
    }
    if (s[s.length - 1] === "'" || s[s.length - 1] === "\"") {
        s = s.slice(0, -1);
    }
    return s;
}
