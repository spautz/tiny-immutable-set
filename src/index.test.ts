/* eslint-env jest */
import set from '.';

describe('basic functionality', () => {
  describe('shallow objects', () => {
    it('sets new values', () => {
      const obj = { abc: 123 };
      const newObj = set(obj, 'def', 456);

      expect(newObj).toEqual({ abc: 123, def: 456 });
      expect(newObj).not.toEqual(obj);
    });

    it('sets existing values', () => {
      const obj = { abc: 123 };
      const newObj = set(obj, 'abc', 456);

      expect(newObj).toEqual({ abc: 456 });
      expect(newObj).not.toEqual(obj);
    });

    it('sets value in arrays', () => {
      const obj = ['one', 'two', 'three'];
      const newObj = set(obj, 1, 456);

      expect(newObj).toEqual(['one', 456, 'three']);
      expect(newObj).not.toEqual(obj);
    });
  });

  describe('deep objects', () => {
    let obj: any;
    beforeEach(() => {
      obj = {
        abc: {
          def: [{ foo: 'foo' }, { bar: 'bar' }, { baz: 'baz' }],
          ghi: [123],
        },
      };
    });

    it('sets new deep values', () => {
      const newObj = set(obj, ['foo', 'bar', 'baz'], 456);

      expect(newObj).toEqual({
        abc: {
          def: [{ foo: 'foo' }, { bar: 'bar' }, { baz: 'baz' }],
          ghi: [123],
        },
        foo: { bar: { baz: 456 } },
      });
      expect(newObj).not.toEqual(obj);
      expect(newObj.foo).not.toEqual(obj.foo);
      expect(newObj.abc).toStrictEqual(obj.abc);
    });

    it('sets new deep values in existing paths', () => {
      const newObj = set(obj, 'abc.bar.baz', 456);

      expect(newObj).toEqual({
        abc: {
          def: [{ foo: 'foo' }, { bar: 'bar' }, { baz: 'baz' }],
          ghi: [123],
          bar: { baz: 456 },
        },
      });
      expect(newObj).not.toEqual(obj);
      expect(newObj.abc).not.toEqual(obj.abc);
      expect(newObj.abc.def).toStrictEqual(obj.abc.def);
      expect(newObj.abc.ghi).toStrictEqual(obj.abc.ghi);
    });

    it('sets new deep values in arrays', () => {
      const newObj = set(obj, ['abc', 'def', 1, 'bar'], 456);

      expect(newObj).toEqual({
        abc: {
          def: [{ foo: 'foo' }, { bar: 456 }, { baz: 'baz' }],
          ghi: [123],
        },
      });
      expect(newObj).not.toEqual(obj);
      expect(newObj.abc).not.toEqual(obj.abc);
      expect(newObj.abc.def).not.toEqual(obj.abc.def);
      expect(newObj.abc.def[1]).not.toEqual(obj.abc.def[1]);
      expect(newObj.abc.def[0]).toStrictEqual(obj.abc.def[0]);
      expect(newObj.abc.def[2]).toStrictEqual(obj.abc.def[2]);
      expect(newObj.abc.ghi).toStrictEqual(obj.abc.ghi);
    });

    it('sets new deep values in nested arrays', () => {
      const newObj = set(obj, 'abc.ghi[1][0][0]', 456);

      expect(newObj).toEqual({
        abc: {
          def: [{ foo: 'foo' }, { bar: 'bar' }, { baz: 'baz' }],
          ghi: [123, [[456]]],
        },
      });
      expect(newObj).not.toEqual(obj);
      expect(newObj.abc).not.toEqual(obj.abc);
      expect(newObj.abc.ghi).not.toEqual(obj.abc.ghi);
      expect(newObj.abc.def).toStrictEqual(obj.abc.def);
    });
  });
});
