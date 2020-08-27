const { Timeline } = require('@nelsongomes/ts-timeframe');

const allLibraries = [
  require('./libraries/immer'),
  require('./libraries/immutable'),
  require('./libraries/immutable-assign'),
  require('./libraries/lodash'),
  require('./libraries/seamless-immutable'),
  require('./libraries/tiny-immutable-set'),
];

const allScenarios = [runStringScenario, runArrayScenario, runStringScenario, runArrayScenario];

const iterationsPerRun = 50000;

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

//////////////////////////////////
function deepFreeze(object) {
  // Retrieve the property names defined on object
  var propNames = Object.getOwnPropertyNames(object);

  // Freeze properties before freezing self

  for (let name of propNames) {
    let value = object[name];

    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }

  return Object.freeze(object);
}

deepFreeze(TEST_OBJECT);

//////////////////////////////////

function runStringScenario(libraryInfo) {
  const { label: libraryLabel, setWithString, timeline } = libraryInfo;

  if (setWithString) {
    // Pre-generate all paths
    const allPaths = [];
    for (let i = 0; i < iterationsPerRun; i++) {
      const propNum = i % TEST_OBJECT_BREADTH;
      const indexNum = (i / TEST_OBJECT_BREADTH) % TEST_OBJECT_BREADTH;
      const deepNum = (i / (TEST_OBJECT_BREADTH * TEST_OBJECT_BREADTH)) % TEST_OBJECT_BREADTH;
      allPaths.push(`${propNum}[${indexNum}].${deepNum}`);
    }

    const event = timeline.startEvent(['string-path']);
    for (let i = 0; i < iterationsPerRun; i++) {
      setWithString(TEST_OBJECT, allPaths[i], i);
    }
    event.end();
  } else {
    console.error(`Library "${libraryLabel}" is missing the setWithArray scenario!`);
  }
}

function runArrayScenario(libraryInfo) {
  const { libraryLabel, setWithArray, timeline } = libraryInfo;

  if (setWithArray) {
    // Pre-generate all paths
    const allPaths = [];
    for (let i = 0; i < iterationsPerRun; i++) {
      const prop = i % TEST_OBJECT_BREADTH;
      const index = (i / TEST_OBJECT_BREADTH) % TEST_OBJECT_BREADTH;
      const deep = (i / (TEST_OBJECT_BREADTH * TEST_OBJECT_BREADTH)) % TEST_OBJECT_BREADTH;
      allPaths.push([prop, index, deep]);
    }

    const event = timeline.startEvent(['array-path']);
    for (let i = 0; i < iterationsPerRun; i++) {
      setWithArray(TEST_OBJECT, allPaths[i], i);
    }
    event.end();
  } else {
    console.error(`Library "${libraryLabel}" is missing the setWithArray scenario!`);
  }
}

function accumulateTime(timeInfo, timeLineEvent) {
  const [seconds, nanoseconds] = timeLineEvent.getDurationRaw();

  timeInfo.seconds += seconds;
  timeInfo.nanoseconds += nanoseconds;
  while (timeInfo.nanoseconds > 1e9) {
    timeInfo.seconds++;
    timeInfo.nanoseconds -= 1e9;
  }

  timeInfo.count++;
  return timeInfo;
}

// We're going to run through each (library, scenario) tuple twice:
//  1. For each library, run each scenario type
//  2. For each scenario type, run each library

for (let libNum = 0; libNum < allLibraries.length; libNum++) {
  allLibraries[libNum].timeline = new Timeline();

  for (let scenarioNum = 0; scenarioNum < allScenarios.length; scenarioNum++) {
    allScenarios[scenarioNum](allLibraries[libNum]);
  }
}

for (let scenarioNum = 0; scenarioNum < allScenarios.length; scenarioNum++) {
  for (let libNum = 0; libNum < allLibraries.length; libNum++) {
    allScenarios[scenarioNum](allLibraries[libNum]);
  }
}

// Now let's take a look at the results

for (let libNum = 0; libNum < allLibraries.length; libNum++) {
  const { label: libraryLabel, timeline } = allLibraries[libNum];
  timeline.end();

  // Average together each scenario's times, as well as the overall time.
  // Similar to ts-timeframe, seconds and nanoseconds are stored separately for more accurate calculations.
  const totalTimeByLabel = {};
  const totalTimeSum = { seconds: 0, nanoseconds: 0, count: 0 };
  // Start from 1 to skip time that wasn't devoted to any task
  for (let i = 1; i < timeline.timeLineEvents.length; i++) {
    const thisEvent = timeline.timeLineEvents[i];

    // Accumulate label time
    const [scenarioLabel] = thisEvent.getLabels();
    totalTimeByLabel[scenarioLabel] = totalTimeByLabel[scenarioLabel] || {
      seconds: 0,
      nanoseconds: 0,
      count: 0,
    };
    accumulateTime(totalTimeByLabel[scenarioLabel], thisEvent);

    // Accumulate total time
    accumulateTime(totalTimeSum, thisEvent);
  }

  // Now output the results
  console.log(`==== ${libraryLabel} ====`);
  Object.keys(totalTimeByLabel).forEach((scenarioLabel) => {
    const { seconds, nanoseconds } = totalTimeByLabel[scenarioLabel];
    console.log(`${scenarioLabel}: ${seconds}.${nanoseconds}`);
  });
  const { seconds, nanoseconds } = totalTimeSum;
  console.log(`Overall: ${seconds}.${nanoseconds}`);
}
console.log('==== (end of benchmark results) ====');
