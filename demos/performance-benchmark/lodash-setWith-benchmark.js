/* eslint-disable */

// This needs to be copy/pasted into either ImmutableAssign's benchmarks runner or the immutable-benchmarks suite
// to run the benchmark.

const lodashSetWithBenchmark = {
  init: function () {
    var obj = _.cloneDeep(INITIAL_OBJECT);
    if (_isDevel) {
      obj = deepFreeze(obj);
    }
    return obj;
  },
  get: function (obj, key) {
    return obj[key];
  },
  set: function (obj, key, val) {
    // Paul Note
    if (obj[key] === val) return obj;

    return _.setWith(_.clone(obj), key, val, _.clone);
  },
  getDeep: function (obj, key1, key2) {
    return obj[key1][key2];
  },
  setDeep: function (obj, key1, key2, val) {
    return _.setWith(_.clone(obj), [key1, key2], val, _.clone);
  },
  getIn: _getIn,
  setIn: function (obj, path, val) {
    return _.setWith(_.clone(obj), path, val, _.clone);
  },
  merge: function (obj1, obj2) {
    return Object.assign({}, obj1, obj2);
  },
  initArr: function (array) {
    if (!array) {
      array = INITIAL_ARRAY;
    }

    var obj = _.cloneDeep(array);
    if (_isDevel) {
      obj = deepFreeze(obj);
    }
    return obj;
  },
  getAt: function (arr, idx) {
    return arr[idx];
  },
  setAt: function (arr, idx, val) {
    return _.setWith(_.clone(arr), idx, val, _.clone);
  },
  getAtDeep: function (arr, idx1, idx2) {
    return arr[idx1][idx2];
  },
  setAtDeep: function (arr, idx1, idx2, val) {
    return _.setWith(_.clone(arr), [idx1, idx2], val, _.clone);
  },
};

_allTests('lodash-setWith', lodashSetWithBenchmark);
// _allTests("tiny-setWith + deep freeze", lodashSetWithBenchmark);
