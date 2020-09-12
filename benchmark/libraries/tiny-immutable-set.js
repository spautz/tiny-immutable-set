const { set } = require('tiny-immutable-set');

const tinyImmutableSetCase = {
  label: 'tiny-immutable-set',
  prepareTestObject: null,
  completeTestObject: null,
  setWithArray: set,
  setWithString: set,
  setWithArrayString: set,
};

module.exports = tinyImmutableSetCase;
