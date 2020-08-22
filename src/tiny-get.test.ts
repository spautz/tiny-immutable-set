/* eslint-env jest */
import { get } from '@ngard/tiny-get';

import { set } from '.';

/*
 * This is adapted from the test suite from tiny-get, which this library is inspired by.
 * https://github.com/NickGard/tiny-get
 *
 * It was converted to Typescript, and each case was changed to perform a set() using the same paths
 * that it tests for get()
 */
describe('set object properties', () => {
  const weirdKeys = [
    ' ',
    "'",
    '"',
    ']',
    '[',
    "['a']",
    "['a",
    '{}',
    ' a',
    ' a.b',
    'a.b',
    '%$^',
    '😱',
    '0',
    0,
    '  0  ',
    '"0"',
  ];
  const obj = {
    az: {
      b: 'success',
    },
  };
  const validNestedAccessors = [
    '["az"]["b"]',
    "['az']['b']",
    `['az']["b"]`,
    `["az"]['b']`,
    'az["b"]',
    "az['b']",
    `['az'].b`,
    `["az"].b`,
    'az.b',
    ' az . b ',
    ' [ "az" ] [ "b" ] ',
    " [ 'az' ] [ 'b' ] ",
    ` [ 'az' ] [ "b" ] `,
    ` [ "az" ] [ 'b' ] `,
    ' az [ "b" ] ',
    " az [ 'b' ] ",
    ` [ 'az' ] . b `,
    ` [ "az" ] . b `,
  ];

  validNestedAccessors.forEach((key) => {
    it(`should properly set property <<${key}>>`, () => {
      const newObj = set(obj, key, 'new-value');
      // Original unchanged
      expect(get(obj, key, 'default')).toEqual('success');
      // New has value
      expect(get(newObj, key, 'default')).toEqual('new-value');
      // New !== old
      expect(newObj).not.toEqual(obj);
    });
  });

  weirdKeys.forEach((key) => {
    it(`should set the value at <<${key}>> rather than a nested value`, () => {
      const obj = weirdKeys.reduce<Record<string, string>>((o, k) => {
        o[k] = 'success';
        return o;
      }, {});
      const newObj = set(obj, key, 'new-value');

      // Original unchanged
      expect(get(obj, key)).toEqual('success');
      // New has value
      expect(get(newObj, key)).toEqual('new-value');
      // New !== old
      expect(newObj).not.toEqual(obj);
      expect(newObj[key]).not.toEqual(obj[key]);
    });
  });

  it('should set a top-level weird key before following the same path', () => {
    const obj = { a: { b: 'fail' }, 'a.b': 'success' };
    const newObj = set(obj, 'a.b', 'new-value');

    // Original unchanged
    expect(get(obj, 'a.b')).toEqual('success');
    // New has value
    expect(get(newObj, 'a.b')).toEqual('new-value');
    // New !== old, except the unchanged paths
    expect(newObj).not.toEqual(obj);
    expect(newObj['a.b']).not.toEqual(obj['a.b']);
    expect(newObj.a).toStrictEqual(obj.a);
  });
});

describe('set object property with an array path', () => {
  it('should set an object property with sane key names', () => {
    const obj = {
      foo: {
        bar: {
          baz: 'success',
        },
      },
    };
    const newObj = set(obj, "['foo']['bar']['baz']", 'new-value');

    // Original unchanged
    expect(get(obj, "['foo']['bar']['baz']")).toEqual('success');
    expect(obj['foo']['bar']['baz']).toEqual('success');
    // New has value
    expect(get(newObj, "['foo']['bar']['baz']")).toEqual('new-value');
    // New !== old
    expect(newObj).not.toEqual(obj);
  });
  it('should set an object property with weird key names', () => {
    const obj = {
      '[fo': {
        'o]': 'success',
      },
      foo: { result: 'failure' },
    };
    const newObj = set(obj, "['[fo']['o]']", 'new-value');

    // Original unchanged
    expect(get(obj, "['[fo']['o]']")).toEqual('success');
    // New has value
    expect(get(newObj, "['[fo']['o]']")).toEqual('new-value');
    // New !== old, except the parts that we left alone
    expect(newObj).not.toEqual(obj);
    expect(newObj['[fo']).not.toEqual(obj['[fo']);
    expect(newObj.foo).toStrictEqual(obj.foo);
  });
});

describe('set array values', () => {
  const arr = ['one', { two: ['success'], twoB: [] }, { three: 3 }] as const;
  it('should handle array indexes as part of a path', () => {
    const newArr = set(arr, '[1].two[0]', 'new-value');

    // Original unchanged
    expect(get(arr, '[1].two[0]')).toEqual('success');
    // New has value
    expect(get(newArr, '[1].two[0]')).toEqual('new-value');
    // New !== old, except the parts that we left alone
    expect(newArr).not.toEqual(arr);
    expect(newArr[1]).not.toEqual(arr[1]);
    expect(newArr[1].two).not.toEqual(arr[1].two);
    expect(newArr[1].twoB).toStrictEqual(arr[1].twoB);
    expect(newArr[2]).toStrictEqual(arr[2]);
  });
});
