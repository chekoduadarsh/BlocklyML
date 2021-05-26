/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
export var browserNames = {
    E: 'Edge',
    FF: 'Firefox',
    S: 'Safari',
    C: 'Chrome',
    IE: 'IE',
    O: 'Opera'
};
function getEntryStatus(status) {
    switch (status) {
        case 'experimental':
            return '⚠️ Property is experimental. Be cautious when using it.️\n\n';
        case 'nonstandard':
            return '🚨️ Property is nonstandard. Avoid using it.\n\n';
        case 'obsolete':
            return '🚨️️️ Property is obsolete. Avoid using it.\n\n';
        default:
            return '';
    }
}
export function getEntryDescription(entry, doesSupportMarkdown) {
    if (doesSupportMarkdown) {
        return {
            kind: 'markdown',
            value: getEntryMarkdownDescription(entry)
        };
    }
    else {
        return {
            kind: 'plaintext',
            value: getEntryStringDescription(entry)
        };
    }
}
function getEntryStringDescription(entry) {
    if (!entry.description || entry.description === '') {
        return '';
    }
    if (typeof entry.description !== 'string') {
        return entry.description.value;
    }
    var result = '';
    if (entry.status) {
        result += getEntryStatus(entry.status);
    }
    result += entry.description;
    var browserLabel = getBrowserLabel(entry.browsers);
    if (browserLabel) {
        result += '\n(' + browserLabel + ')';
    }
    if ('syntax' in entry) {
        result += "\n\nSyntax: " + entry.syntax;
    }
    if (entry.references && entry.references.length > 0) {
        result += '\n\n';
        result += entry.references.map(function (r) {
            return r.name + ": " + r.url;
        }).join(' | ');
    }
    return result;
}
function getEntryMarkdownDescription(entry) {
    if (!entry.description || entry.description === '') {
        return '';
    }
    var result = '';
    if (entry.status) {
        result += getEntryStatus(entry.status);
    }
    if (typeof entry.description === 'string') {
        result += entry.description;
    }
    else {
        result = entry.description.value;
    }
    var browserLabel = getBrowserLabel(entry.browsers);
    if (browserLabel) {
        result += '\n\n(' + browserLabel + ')';
    }
    if ('syntax' in entry) {
        result += "\n\nSyntax: " + entry.syntax;
    }
    if (entry.references && entry.references.length > 0) {
        result += '\n\n';
        result += entry.references.map(function (r) {
            return "[" + r.name + "](" + r.url + ")";
        }).join(' | ');
    }
    return result;
}
/**
 * Input is like `["E12","FF49","C47","IE","O"]`
 * Output is like `Edge 12, Firefox 49, Chrome 47, IE, Opera`
 */
export function getBrowserLabel(browsers) {
    if (browsers === void 0) { browsers = []; }
    if (browsers.length === 0) {
        return null;
    }
    return browsers
        .map(function (b) {
        var result = '';
        var matches = b.match(/([A-Z]+)(\d+)?/);
        var name = matches[1];
        var version = matches[2];
        if (name in browserNames) {
            result += browserNames[name];
        }
        if (version) {
            result += ' ' + version;
        }
        return result;
    })
        .join(', ');
}
