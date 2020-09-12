const TEST_OBJECT = require('../testObject');
const { generatePaths } = require('./scenario-utils');

const setWithArray = {
  id: 'setWithArray',
  label: '["prop1", "prop2", "prop3"]',
  setup: (numCasesToGenerate) => {
    // 60% of the paths will exist, 40% will be new
    const numExistingCasesToGenerate = Math.floor(0.6 * numCasesToGenerate);
    const rawPaths = generatePaths(
      TEST_OBJECT,
      numExistingCasesToGenerate,
      numCasesToGenerate - numExistingCasesToGenerate,
    );

    // Each path is its own test case
    return rawPaths.map((pathParts, index) => [TEST_OBJECT, pathParts, index]);
  },
  teardown: null,
};

module.exports = setWithArray;
