const setWith = require('lodash/setWith');
const clone = require('lodash/clone');

const lodashImmutableSet = (obj, path, value) => setWith(clone(obj), path, value, clone);

const lodashCase = {
  label: 'lodash',
  setWithString: lodashImmutableSet,
  setWithArray: lodashImmutableSet,
};

module.exports = lodashCase;
