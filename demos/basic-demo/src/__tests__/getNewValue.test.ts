import { afterEach, describe, expect, test, vi } from 'vitest';

import { getNewValue, originalValue } from '../getNewValue.js';

describe('getNewValue', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('creates a new object', () => {
    const newValue = getNewValue();

    expect(newValue === originalValue).toBeFalsy();
  });

  test('creates new objects in middle levels', () => {
    const newValue = getNewValue();

    expect(newValue.someNumbers === originalValue.someNumbers).toBeFalsy();
  });

  test("sets the 'two' key properly", () => {
    const newValue = getNewValue();

    expect(newValue.someNumbers.two).toEqual(2);
  });

  test('creates a new object every time', () => {
    const newValue1 = getNewValue();
    const newValue2 = getNewValue();

    expect(newValue1 === originalValue).toBeFalsy();
    expect(newValue2 === originalValue).toBeFalsy();
    expect(newValue1 === newValue2).toBeFalsy();
    expect(newValue1.someNumbers === newValue2.someNumbers).toBeFalsy();
  });
});
