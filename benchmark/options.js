const options = {
  /* How many times each scenario is run for each library */
  numIterations: 10000,
  /* Whether to console.log while libraries and scenarios are running */
  showLogs: true,
  /* Whether to console.warn if a library hasn't implemented a scenario */
  showWarnings: true,

  // To check against order-of-execution issues, we can run libraries-for-each-scenario, scenarios-for-each-library,
  // or both. This is mostly to validate the benchmark runner itself. (Running both will double the number of
  // iterations, and it won't give you any more information since execution order doesn't matter.)
  loopLibrariesThenScenarios: true,
  loopScenariosThenLibraries: true,
};

module.exports = options;
