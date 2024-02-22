import { set } from '#tiny-immutable-set';

const originalValue = {
  someNumbers: {
    one: 1,
    two: 1,
  },
};

function getNewValue() {
  const newValue = set(originalValue, 'someNumbers.two', 2);
  return newValue;
}

export { getNewValue, originalValue };
