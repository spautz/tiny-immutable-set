const setWith = require('lodash/setWith');
const clone = require('lodash/clone');

const set = (obj, path, value) => setWith(clone(obj), path, value, clone);

const lodashCase = {
  label: 'lodash',
  setWithString: set,
  setWithArray: set,
  setWithArrayString: set,
};

module.exports = lodashCase;
