const DEFAULT_ITERATIONS_PER_RUN = 0;

// Create a massive test object:
// An object of arrays of objects, with 5 items at each level
const TEST_OBJECT_BREADTH = 5;
const TEST_OBJECT = {};
for (let propNum = 0; propNum < TEST_OBJECT_BREADTH; propNum++) {
  TEST_OBJECT[`prop${propNum}`] = [];
  for (let indexNum = 0; indexNum < TEST_OBJECT_BREADTH; indexNum++) {
    const obj = {};
    for (let deepNum = 0; deepNum < TEST_OBJECT_BREADTH; deepNum++) {
      obj[`deep${deepNum}`] = deepNum;
    }
    TEST_OBJECT[`prop${propNum}`].push(obj);
  }
}

function generateScenarios({ scenarioList, iterationsPerRun }) {
  return scenarioList.map((scenarioFn) => {
    const boundFn = scenarioFn.bind(null, iterationsPerRun || DEFAULT_ITERATIONS_PER_RUN);
    boundFn.displayName = scenarioFn.displayName;
    return boundFn;
  });
}

function getPathParts(i) {
  const propNum = i % TEST_OBJECT_BREADTH;
  const indexNum = Math.floor(i / TEST_OBJECT_BREADTH) % TEST_OBJECT_BREADTH;
  const deepNum = Math.floor(i / (TEST_OBJECT_BREADTH * TEST_OBJECT_BREADTH)) % TEST_OBJECT_BREADTH;
  return [`prop${propNum}`, indexNum, `deep${deepNum}`];
}

// Scenario runners:

const runStringScenarioLabel = 'string-path';
function runStringScenario(numIterations, libraryInfo) {
  const { label: libraryLabel, setWithString, timeline } = libraryInfo;

  if (setWithString) {
    // Pre-generate all paths
    const allPaths = [];
    for (let i = 0; i < numIterations; i++) {
      // To make things more fair for libraries that only support dot notation (instead of array notation within the
      // path), we'll encode the array index as if it were a normal property.
      allPaths.push(getPathParts(i).join('.'));
    }

    const event = timeline.startEvent([runStringScenarioLabel]);
    for (let i = 0; i < numIterations; i++) {
      setWithString(TEST_OBJECT, allPaths[i], i);
    }
    event.end();
  } else {
    console.error(`Library "${libraryLabel}" is missing the setWithString scenario!`);
  }
}
runStringScenario.displayName = runStringScenarioLabel;

const runArrayScenarioLabel = 'array-path';
function runArrayScenario(numIterations, libraryInfo) {
  const { libraryLabel, setWithArray, timeline } = libraryInfo;

  if (setWithArray) {
    // Pre-generate all paths
    const allPaths = [];
    for (let i = 0; i < numIterations; i++) {
      allPaths.push(getPathParts(i));
    }

    const event = timeline.startEvent([runArrayScenarioLabel]);
    for (let i = 0; i < numIterations; i++) {
      setWithArray(TEST_OBJECT, allPaths[i], i);
    }
    event.end();
  } else {
    console.error(`Library "${libraryLabel}" is missing the setWithArray scenario!`);
  }
}
runArrayScenario.displayName = runArrayScenarioLabel;

const runArrayStringScenarioLabel = 'arraystring-path';
function runArrayStringScenario(numIterations, libraryInfo) {
  const { label: libraryLabel, setWithArrayString, timeline } = libraryInfo;

  if (setWithArrayString) {
    // Pre-generate all paths
    const allPaths = [];
    for (let i = 0; i < numIterations; i++) {
      const [prop, index, deep] = getPathParts(i);
      allPaths.push(`${prop}[${index}].${deep}`);
    }

    const event = timeline.startEvent([runArrayStringScenarioLabel]);
    for (let i = 0; i < numIterations; i++) {
      setWithArrayString(TEST_OBJECT, allPaths[i], i);
    }
    event.end();
  } else {
    console.error(`Library "${libraryLabel}" is missing the setWithArrayString scenario!`);
  }
}
runArrayStringScenario.displayName = runArrayStringScenarioLabel;

module.exports = { generateScenarios, runStringScenario, runArrayScenario, runArrayStringScenario };
