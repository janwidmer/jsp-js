let vm = require('vm');
const fs = require('fs');

/**
 * k1='v1' k2="v2" => {k1: "v1", k2: "v2"}
 * @param {String} text
 * @return {Object}
 */
function getAttrs(text) {
    let attrs = {};
    let reAttr = /(\w+)=['"](.+?)['"]/g;
    let m;

    while (m = reAttr.exec(text)) {
        attrs[m[1]] = m[2];
    }
    return attrs;
}

function tokenAttrs(tokenText, offset) {
    return getAttrs(tokenText.slice(offset, -1));
}

/**
 * Returns all attributes from a HTML node
 * @param {*} node
 * @param {bool} closedTag
 */
function getNodeAttrs(node, closedTag) {
    let endTag = '>';

    if (closedTag === true) {
        endTag = '/>';
    }
    let text = node.token.text.slice(
        node.token.name.length + 1,
        node.token.text.indexOf(endTag)
    ).trim();

    return getAttrs(text);
}

/**
 * Returns the attributes of an object from a dotted-string
 * @param {*} obj
 * @param {String} dottedString
 * @param {*} fallback
 */
function getObjectAttrFromDottedString(obj, dottedString, fallback) {
    if (!obj || typeof obj === 'undefined') {
        return fallback;
    }

    let path = dottedString.split('.');
    let item = obj;

    try {
        path.forEach((key) => item = item[key]);
        return item;
    } catch (e) {
        return fallback;
    }
}

/**
 * @param {String} exp
 * @param {Object} data
 * @return {*} exp's value when run at the context of data
 */
function evalExp(exp, data) {
    if (data && exp in data) {
        return data[exp];
    }
    exp = exp.replace('fn:', 'fn_');
    try {
        let context = vm.createContext(Object.assign(
            {},
            data,
            {
                'fn_contains': (inputString, subString) => inputString.indexOf(subString) > -1,
                'fn_containsIgnoreCase': (inputString, subString) => {
                    return inputString.toLowerCase().indexOf(subString.toLowerCase()) > -1;
                },
                'fn_endsWith': (inputString, subString) => {
                    return inputString.indexOf(subString) === (inputString.length - subString.length);
                },
                'fn_escapeXml': (inputString) => {
                    return inputString.replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&apos;');
                },
                'fn_indexOf': (inputString, subString) => inputString.indexOf(subString),
                'fn_join': (inputArray, param) => inputArray.join(param),
                'fn_length': (inputCollection) => inputCollection.length,
                'fn_replace': (inputString, subString, newSubString) => {
                    const regex = new RegExp(subString, 'g');
                    return inputString.replace(regex, newSubString);
                },
                'fn_startsWith': (inputString, subString) => inputString.indexOf(subString) === 0,
                'fn_substring': (inputString, startIndex, EndIndex) => inputString.substring(startIndex, EndIndex),
                'fn_substringAfter': (inputString, subString) => {
                    const startIndex = inputString.indexOf(subString);
                    const subStringLength = subString.length;
                    return inputString.substring((startIndex + subStringLength), inputString.length);
                },
                'fn_substringBefore': (inputString, subString) => {
                    const startIndex = inputString.indexOf(subString);
                    return inputString.substring(0, startIndex);
                },
                'fn_split': (inputString, delimiter) => inputString.split(delimiter),
                'fn_toUpperCase': (inputString) => String(inputString).toUpperCase(),
                'fn_toLowerCase': (inputString) => String(inputString).toLowerCase(),
                'fn_trim': (inputString) => String(inputString).trim()
            }
        ));
        let result = vm.runInContext(exp, context);
        if (result === null || result === 'null') {
            return '';
        }
        return result;
    } catch (e) {
        return null;
    }
}

/**
 * Synchronously checks if a path exists, be it file or directory.
 * @param {String} path
 * @returns {Boolean}
 */
function checkPathExistsSync(path) {
    try {
        fs.statSync(path);
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    tokenAttrs,
    getAttrs,
    evalExp,
    getNodeAttrs,
    getObjectAttrFromDottedString,
    checkPathExistsSync
};
