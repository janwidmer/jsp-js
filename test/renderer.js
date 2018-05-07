const assert = require('assert');
const Renderer = require('../lib/renderer');

function renderText(text, data) {
    let renderer = new Renderer({});
    return renderer.renderText(text, data);
}

describe('Renderer', () => {
    it('Does not mess up HTML', () => {
        const html = '<p>Blah <br />blah</p>';
        let doc = renderText(html, {});
        assert.equal(doc, html);
    });

    it('Prints data in the HTML', () => {
        const html = 'Hello ${name} interpreter';
        let doc = renderText(html, {name: 'JSP'});
        assert.equal(doc, 'Hello JSP interpreter');
    });

    describe('fn: functions', () => {
        it('Returns true if given sub string is contained in string by using fn:contains', () => {
            const stringToTest = 'This is a string containing a sub string';
            const subString = 'his';
            const html = '${fn:contains(stringToTest, subString)}';
            let doc = renderText(html, {stringToTest, subString});
            assert.equal(doc, 'true');
        });

        it('Returns true if given sub string is contained (ignore case) in string by using fn:containsIgnoreCase', () => {
            const stringToTest = 'This is a string containing a sub string';
            const subString = 'HIS';
            const html = '${fn:containsIgnoreCase(stringToTest, subString)}';
            let doc = renderText(html, {stringToTest, subString});
            assert.equal(doc, 'true');
        });

        it('Returns true if given sub string is at the end of the string by using fn:endsWith', () => {
            const stringToTest = 'Here is a string ending with the word This';
            const subString = 'This';
            const html = '${fn:endsWith(stringToTest, subString)}';
            let doc = renderText(html, {stringToTest, subString});
            assert.equal(doc, 'true');
        });

        it('Correctly escapes xml chars by using fn:escapeXml', () => {
            const stringToEscape = '<p>This is a Test String & to demonstrate "xml" escaping</p>';
            const html = '${fn:escapeXml(stringToEscape)}';
            let doc = renderText(html, {stringToEscape});
            assert.equal(doc, '&lt;p&gt;This is a Test String &amp; to demonstrate &quot;xml&quot; escaping&lt;/p&gt;');
        });

        it('Returns a string representing the joined array by using fn:join', () => {
            const arrayToJoin = ['Item 1', 'Item 2', 'Item 3'];
            const separator = ';';
            const html = '${fn:join(arrayToJoin, separator)}';
            let doc = renderText(html, {arrayToJoin, separator});
            assert.equal(doc, 'Item 1;Item 2;Item 3');
        });

        it('Returns length of a collection or array by using fn:length', () => {
            const arrayWith3Entries = ['Item 1', 'Item 2', 'Item 3'];
            const html = '${fn:length(arrayWith3Entries)}';
            let doc = renderText(html, {arrayWith3Entries});
            assert.equal(doc, '3');
        });

        it('Returns length of a string by using fn:length', () => {
            const stringToTest = 'This is a string to get it\'s length';
            const html = '${fn:length(stringToTest)}';
            let doc = renderText(html, {stringToTest});
            assert.equal(doc, '35');
        });

        it('Replaces a sub string within a string by another sub string by using fn:replace', () => {
            const stringToTest = 'This is a string starting to replace the word This';
            const subString = 'This';
            const newSubString = 'That';
            const html = '${fn:replace(stringToTest, subString, newSubString)}';
            let doc = renderText(html, {stringToTest, subString, newSubString});
            assert.equal(doc, 'That is a string starting to replace the word That');
        });

        it('Returns an array (toString) representing the splitted string by using fn:split', () => {
            const arrayToSplit = 'Item 1<>Item 2<>Item 3';
            const separator = '<>';
            const html = '${fn:split(arrayToSplit, separator)}';
            let doc = renderText(html, {arrayToSplit, separator});
            assert.equal(doc, 'Item 1,Item 2,Item 3');
        });

        it('Returns true if given sub string is at the begin of the string by using fn:startsWith', () => {
            const stringToTest = 'This is a string starting with the word This';
            const subString = 'This';
            const html = '${fn:startsWith(stringToTest, subString)}';
            let doc = renderText(html, {stringToTest, subString});
            assert.equal(doc, 'true');
        });

        it('Returns a subset of a string specified by start and end indices by using fn:substring', () => {
            const stringToTest = 'This is first String.';
            const html = '${fn:substring(stringToTest, 5, 15)}';
            let doc = renderText(html, {stringToTest});
            assert.equal(doc, 'is first S');
        });

        it('Returns a subset of a string after a specified string by using fn:substringAfter', () => {
            const stringToTest = 'This is first String.';
            const subStringAfter = 'is';
            const html = '${fn:substringAfter(stringToTest, subStringAfter)}';
            let doc = renderText(html, {stringToTest, subStringAfter});
            assert.equal(doc, ' is first String.');
        });

        it('Returns a subset of a string before a specified string by using fn:substringBefore', () => {
            const stringToTest = 'This is first String.';
            const subStringAfter = 'first';
            const html = '${fn:substringBefore(stringToTest, subStringAfter)}';
            let doc = renderText(html, {stringToTest, subStringAfter});
            assert.equal(doc, 'This is ');
        });

        it('Returns an all lower case string by using fn:toLowerCase', () => {
            const stringToTest = 'This is a string with soMe UPPER cAsE LETTERS';
            const html = '${fn:toLowerCase(stringToTest)}';
            let doc = renderText(html, {stringToTest});
            assert.equal(doc, 'this is a string with some upper case letters');
        });

        it('Returns an all upper case string by using fn:toUpperCase', () => {
            const stringToTest = 'This is a string with soMe lower cAsE LETTERS';
            const html = '${fn:toUpperCase(stringToTest)}';
            let doc = renderText(html, {stringToTest});
            assert.equal(doc, 'THIS IS A STRING WITH SOME LOWER CASE LETTERS');
        });

        it('Returns a string without spaces at the begin and the end of the string by using fn:toUpperCase', () => {
            const stringToTest = '   This is a string with spaces at the begin and the end    ';
            const html = '${fn:trim(stringToTest)}';
            let doc = renderText(html, {stringToTest});
            assert.equal(doc, 'This is a string with spaces at the begin and the end');
        });
    });
});
