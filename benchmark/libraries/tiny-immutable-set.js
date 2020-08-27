const { set } = require('tiny-immutable-set');

const tinyImmutableSetCase = {
  label: 'tiny-immutable-set',
  setWithString: set,
  setWithArray: set,
  setWithArrayString: set,
};

module.exports = tinyImmutableSetCase;
