const { produce } = require('immer');

const setWithArray = (obj, path, value) => {
  return produce(obj, (draftObj) => {
    let index = 0;
    const pathToTraverse = path.length - 1;
    for (; index < pathToTraverse; index++) {
      draftObj = draftObj[path[index]] || {};
    }
    draftObj[path[index]] = value;
  });
};

const immerCase = {
  label: 'immer',
  setWithString: (obj, path, value) => {
    const pathParts = path.split('.');
    return setWithArray(obj, pathParts, value);
  },
  setWithArray,
  setWithArrayString: (obj, path, value) => {
    const pathParts = path.split(/[\.\[\]]/).filter((token) => !!token);
    return setWithArray(obj, pathParts, value);
  },
};

module.exports = immerCase;
