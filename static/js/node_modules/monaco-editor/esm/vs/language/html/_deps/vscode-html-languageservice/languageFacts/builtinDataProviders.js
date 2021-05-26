/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
import { HTMLDataProvider } from './dataProvider.js';
import { htmlData } from './data/webCustomData.js';
export var builtinDataProviders = [
    new HTMLDataProvider('html5', htmlData)
];
var customDataProviders = [];
export function getAllDataProviders() {
    return builtinDataProviders.concat(customDataProviders);
}
export function handleCustomDataProviders(providers) {
    providers.forEach(function (p) {
        customDataProviders.push(p);
    });
}
