const { generatePaths } = require('./scenario-utils');

const setWithArray = {
  id: 'setWithArray',
  label: '["prop1", "prop2", "prop3"]',
  setup: (baseObject, numCasesToGenerate) => {
    // 60% of the paths will exist, 40% will be new
    const numExistingCasesToGenerate = Math.floor(0.6 * numCasesToGenerate);
    const rawPaths = generatePaths(
      baseObject,
      numExistingCasesToGenerate,
      numCasesToGenerate - numExistingCasesToGenerate,
    );

    return rawPaths;
  },
  teardown: null,
};

module.exports = setWithArray;
