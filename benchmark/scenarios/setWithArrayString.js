const { generatePaths } = require('./scenario-utils');

const setWithArrayString = {
  id: 'setWithArrayString',
  label: '"prop1[prop2][prop3]"',
  setup: (baseObject, numCasesToGenerate) => {
    // 60% of the paths will exist, 40% will be new
    const numExistingCasesToGenerate = Math.floor(0.6 * numCasesToGenerate);
    const rawPaths = generatePaths(
      baseObject,
      numExistingCasesToGenerate,
      numCasesToGenerate - numExistingCasesToGenerate,
    );

    return rawPaths.map((pathParts, index) => `${pathParts[0]}[${pathParts.slice(1).join('][')}]`);
  },
  teardown: null,
};

module.exports = setWithArrayString;
