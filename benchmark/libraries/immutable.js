const Immutable = require('immutable');

// const setIn = (obj, path, value) => obj.setIn(path, value);

const immutableCase = {
  label: 'immutable.js',
  prepareTestObject: (testObject) => Immutable.fromJS(testObject),
  completeTestObject: (testObject) => testObject.toJS(),
  setWithArray: Immutable.setIn,
  setWithString: (obj, path, value) => {
    const pathParts = path.split('.');
    return obj.setIn(pathParts, value);
  },
  setWithArrayString: (obj, path, value) => {
    const pathParts = path.split(/[.[\]]+/).filter((part) => !!part);
    return obj.setIn(pathParts, value);
  },
};

module.exports = immutableCase;
