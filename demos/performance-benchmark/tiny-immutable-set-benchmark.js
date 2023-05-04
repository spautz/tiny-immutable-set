/* eslint-disable */

// This needs to be copy/pasted into either ImmutableAssign's benchmarks runner or the immutable-benchmarks suite
// to run the benchmark.

const { set: tinyImmutableSet } = require('tiny-immutable-set');

const tinyImmutableSetBenchmark = {
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

    return tinyImmutableSet(obj, key, val);
  },
  getDeep: function (obj, key1, key2) {
    return obj[key1][key2];
  },
  setDeep: function (obj, key1, key2, val) {
    return tinyImmutableSet(obj, `${key1}.${key2}`, val);
  },
  getIn: _getIn,
  setIn: function (obj, path, val) {
    return tinyImmutableSet(obj, path, val);
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
    return tinyImmutableSet(arr, idx, val);
  },
  getAtDeep: function (arr, idx1, idx2) {
    return arr[idx1][idx2];
  },
  setAtDeep: function (arr, idx1, idx2, val) {
    return tinyImmutableSet(arr, `${idx1}.${idx2}`, val);
  },
};

_allTests('tiny-immutable-set', tinyImmutableSetBenchmark);
// _allTests("tiny-immutable-set + deep freeze", tinyImmutableSetBenchmark);
