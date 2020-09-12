const isEqual = require('lodash/isEqual');
const { Timeline } = require('@nelsongomes/ts-timeframe');

const options = require('./options');
const allLibraries = require('./libraries');
const allScenarios = require('./scenarios');
const TEST_OBJECT = require('./testObject');

function accumulateTime(timeInfo, timeLineEvent) {
  timeInfo = timeInfo || { seconds: 0, nanoseconds: 0, eventCount: 0 };
  const [seconds, nanoseconds] = timeLineEvent.getDurationRaw();

  timeInfo.seconds += seconds;
  timeInfo.nanoseconds += nanoseconds;
  while (timeInfo.nanoseconds > 1e9) {
    timeInfo.seconds++;
    timeInfo.nanoseconds -= 1e9;
  }

  timeInfo.eventCount++;
  return timeInfo;
}

function formatTime(timeInfo) {
  if (timeInfo) {
    const { seconds, nanoseconds } = timeInfo;
    return `${seconds}.${nanoseconds}`;
  }
  return '(no result)';
}

// Create a timeline to track each (library,scenario) tuple
const timelines = allLibraries.map(() => allScenarios.map(() => new Timeline()));

// Set up each scenario's test cases
const scenarioCases = allScenarios.map((scenarioInfo) => {
  const { numIterations } = options;
  const { id, label, setup } = scenarioInfo;

  if (!setup) {
    throw new Error(`Cannot set up scenario ${id} (${label}): It has no setup()`);
  }
  const cases = setup(TEST_OBJECT, numIterations);

  if (!cases || cases.length !== numIterations) {
    throw new Error(
      `Cannot set up scenario ${id} (${label}): Its setup() should return ${numIterations} cases. We got ${cases &&
        cases.length}`,
    );
  }
  return cases;
});

const allResults = [];

function runTestCases(libraryNum, scenarioNum) {
  const { numIterations, showLogs, showWarnings } = options;
  const { label: scenarioLabel, id: scenarioId } = allScenarios[scenarioNum];
  const {
    label: libraryLabel,
    [scenarioId]: libraryFn,
    prepareTestObject,
    completeTestObject,
  } = allLibraries[libraryNum];
  const cases = scenarioCases[scenarioNum];
  const timeline = timelines[libraryNum][scenarioNum];
  allResults[libraryNum] = allResults[libraryNum] || [];

  if (libraryFn) {
    if (showLogs) {
      console.log(`Running ${scenarioId} (${scenarioLabel}) for ${libraryLabel}`);
    }

    const event = timeline.startEvent();
    let testObject = prepareTestObject ? prepareTestObject(TEST_OBJECT) : TEST_OBJECT;
    for (let i = 0; i < numIterations; i++) {
      testObject = libraryFn(testObject, cases[i], i);
    }
    if (completeTestObject) {
      allResults[libraryNum][scenarioNum] = completeTestObject(testObject);
    }
    event.end();
  } else if (showWarnings) {
    console.error(
      `Library "${libraryLabel}" does not implement the ${scenarioId} (${scenarioLabel}) scenario`,
    );
  }
}

// Here's where we actually run everything

if (options.loopLibrariesThenScenarios) {
  // For each library, run each scenario
  for (let libraryNum = 0; libraryNum < allLibraries.length; libraryNum++) {
    for (let scenarioNum = 0; scenarioNum < allScenarios.length; scenarioNum++) {
      runTestCases(libraryNum, scenarioNum);
    }
  }
}

if (options.loopScenariosThenLibraries) {
  // For each scenario, run each library
  for (let scenarioNum = 0; scenarioNum < allScenarios.length; scenarioNum++) {
    for (let libraryNum = 0; libraryNum < allLibraries.length; libraryNum++) {
      runTestCases(libraryNum, scenarioNum);
    }
  }
}

// Cleanup
for (let scenarioNum = 0; scenarioNum < allScenarios.length; scenarioNum++) {
  const { teardown } = allScenarios[scenarioNum];
  if (teardown) {
    const cases = scenarioCases[scenarioNum];
    teardown(cases);
  }
}

// Validate allResults to make sure everything generated the same end state
for (let scenarioNum = 0; scenarioNum < allScenarios.length; scenarioNum++) {
  for (let libraryNum = 0; libraryNum < allLibraries.length; libraryNum++) {
    const myResults = allResults[libraryNum][scenarioNum];
    // @TODO: Better search
    const otherLibraryResults = allResults.map(
      (scenarioResults) => scenarioResults && scenarioResults[scenarioNum],
    );

    for (let otherLibraryNum = 0; otherLibraryNum < otherLibraryResults.length; otherLibraryNum++) {
      if (
        otherLibraryNum !== libraryNum &&
        myResults &&
        otherLibraryResults[otherLibraryNum] &&
        !isEqual(myResults, otherLibraryResults[otherLibraryNum])
      ) {
        console.error(
          `Library error: the results for ${allLibraries[libraryNum].label} and ${allLibraries[otherLibraryNum].label} do not match each other, for scenario ${allScenarios[scenarioNum].id} (${allScenarios[scenarioNum].label})`,
        );
      }
    }
  }
}

// Now let's tally up the results
const libraryResults = [];
const libraryScenarioResults = [];

for (let libraryNum = 0; libraryNum < allLibraries.length; libraryNum++) {
  libraryResults[libraryNum] = { seconds: 0, nanoseconds: 0 };
  libraryScenarioResults[libraryNum] = [];

  for (let scenarioNum = 0; scenarioNum < allScenarios.length; scenarioNum++) {
    const timeline = timelines[libraryNum][scenarioNum];
    timeline.end();

    // Count each event in the timeline
    // Start from 1 to skip time that wasn't devoted to any task
    for (let i = 1; i < timeline.timeLineEvents.length; i++) {
      const thisEvent = timeline.timeLineEvents[i];

      libraryResults[libraryNum] = accumulateTime(libraryResults[libraryNum], thisEvent);
      libraryScenarioResults[libraryNum][scenarioNum] = accumulateTime(
        libraryScenarioResults[libraryNum][scenarioNum],
        thisEvent,
      );
    }
  }
}

console.log('==== Benchmark Results ====');

// Finally, output numbers for each library and its scenarios
for (let libraryNum = 0; libraryNum < allLibraries.length; libraryNum++) {
  const { label: libraryLabel } = allLibraries[libraryNum];

  console.log(`==== ${libraryLabel} ====`);

  for (let scenarioNum = 0; scenarioNum < allScenarios.length; scenarioNum++) {
    const { label: scenarioLabel, id: scenarioId } = allScenarios[scenarioNum];

    const libraryScenarioTime = libraryScenarioResults[libraryNum][scenarioNum];
    // console.log(`${scenarioId} (${scenarioLabel}): ${formatTime(libraryScenarioTime)}`);
    console.log(`${formatTime(libraryScenarioTime)} : ${scenarioId} (${scenarioLabel})`);
  }

  const libraryTime = libraryResults[libraryNum];
  console.log(`Total: ${formatTime(libraryTime)}`);
}
console.log('==== (end of benchmark results) ====');
