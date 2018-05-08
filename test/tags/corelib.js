const assert = require('assert');
const Renderer = require('../../lib/renderer');
const CoreLib = require('../../lib/tags/corelib');

function lib() {
    let renderer = new Renderer({});
    return new CoreLib({}, renderer);
}

describe('CoreLib', () => {
    it('Sets variables in data', () => {
        let data = {foo: null};
        let result = lib().tagSetData(
            {
                type: 'tag',
                token: {
                    name: 'c:set',
                    type: 'tag',
                    params: {var: 'foo', value: 'bar'},
                    text: '<c:set var="foo" value="bar" />'
                }
            },
            1,
            data
        );
        assert.equal(data.foo, 'bar');
        assert.equal(result.data.foo, 'bar');
    });

    it('Interprets forEach loops', () => {
        const data = {things: [1, 2, 3]};
        let result = lib().tagForeach(
            {
                type: 'tag',
                token: {
                    name: 'c:forEach',
                    type: 'tag',
                    text: '<c:forEach items="things">'
                },
                children: [
                    {
                        type: 'text',
                        token: {
                            type: 'text',
                            text: 'foobar'
                        }
                    }
                ]
            },
            1,
            data
        );
        assert.equal(result, 'foobarfoobarfoobar');
    });

    it('Supports When conditionals', () => {
        const test = (data) => {
            return lib().tagWhen(
                {
                    type: 'tag',
                    token: {
                        name: 'c:when',
                        type: 'tag',
                        text: '<c:when test="val">'
                    },
                    children: [
                        {
                            type: 'text',
                            token: {
                                type: 'text',
                                text: 'foobar'
                            }
                        }
                    ]
                },
                1,
                data
            );
        };
        assert.equal(test({val: true}), 'foobar');
        assert.equal(test({val: false}), '');
    });

    it('Supports url tags for output', () => {
        const test = (data) => {
            return lib().tagUrl(
                {
                    type: 'tag',
                    token: {
                        name: 'c:url',
                        type: 'tag',
                        params: {value: 'http://www.foo with spaces.com/bar'},
                        text: '<c:url value="http://www.foo with spaces.com/bar"/>'
                    },
                    children: [
                        {
                            type: 'tag',
                            token: {
                                name: 'c:param',
                                type: 'tag',
                                params: {name: 'testParam1', value: 'value1;:-'},
                                text: '<c:param name="testParam1" value="value1;:-" />'
                            }
                        },
                        {
                            type: 'tag',
                            token: {
                                name: 'c:param',
                                type: 'tag',
                                params: {name: 'testParam2', value: 'value2'},
                                text: '<c:param name="testParam2" value="value2" />'
                            }
                        }
                    ]
                },
                1,
                data
            );
        };
        assert.equal(test({val: true}), 'http://www.foo with spaces.com/bar?testParam1=value1%3B%3A-&testParam2=value2');
    });

    it('Supports setting variables from url tags', () => {
        const test = (data) => {
            return lib().tagUrl(
                {
                    type: 'tag',
                    token: {
                        name: 'c:url',
                        type: 'tag',
                        params: {value: '/foo/bar'},
                        text: '<c:url var="thing" value="/foo/bar" />'
                    }
                },
                1,
                data
            );
        };
        assert.equal(test({val: true}), '/foo/bar');
    });
});
