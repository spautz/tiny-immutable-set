#!/usr/bin/env node

const { set } = require('tiny-immutable-set');

const originalValue = {
  someNumbers: {
    one: 1,
    two: 1,
  },
};

const newValue = set(originalValue, 'someNumbers.two', 2);

if (newValue === originalValue) {
  throw new Error('tiny-immutable-set did not create a new object');
}
if (newValue.someNumbers === originalValue.someNumbers) {
  throw new Error('tiny-immutable-set did not create a new object within the object');
}
if (newValue.someNumbers.two !== 2) {
  throw new Error('tiny-immutable-set did not set the value properly');
}

console.log('newValue: ', newValue);
