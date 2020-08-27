const { Timeline } = require('@nelsongomes/ts-timeframe');

const {
  generateScenarios,
  runStringScenario,
  runArrayScenario,
  runArrayStringScenario,
} = require('./scenarios');

const allLibraries = [
  require('./libraries/immer'),
  require('./libraries/immutable'),
  require('./libraries/immutable-assign'),
  require('./libraries/lodash'),
  require('./libraries/seamless-immutable'),
  require('./libraries/tiny-immutable-set'),
];

const allScenarios = generateScenarios({
  scenarioList: [
    // runStringScenario,
    // runArrayScenario,
    // runArrayStringScenario,
    // // Weight the plain scenarios more, since those are likely the most common case for most people
    // runStringScenario,
    // runArrayScenario,
    runArrayStringScenario,
    runArrayScenario,
    runArrayStringScenario,
    runArrayScenario,
  ],
  iterationsPerRun: 50000,
});

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
    const library = allLibraries[libNum];
    const scenario = allScenarios[scenarioNum];
    console.log(`Running ${scenario.displayName} for ${library.label}`);
    scenario(library);
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
