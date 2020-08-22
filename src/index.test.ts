/* eslint-env jest */
import set from './index';

describe('basic functionality', () => {
  it('sets values on objects', () => {
    const newObj = set({}, 'abc', 123);

    expect(newObj).toEqual({ abc: 123 });
  });
});
