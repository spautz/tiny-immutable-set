// From https://stackoverflow.com/a/12646864
// Note that the array is mutated
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomPath(object) {
  const path = [];
  let currentObject = object;

  while (typeof currentObject === 'object') {
    const keys = Object.keys(currentObject);
    if (!keys.length) {
      // Don't go into empty objects
      break;
    }

    const key = keys[Math.floor(Math.random() * keys.length)];

    path.push(key);
    currentObject = currentObject[key];
  }

  return path;
}

// To avoid repeating code between the different scenarios, these functions  will generate a bunch of paths exist /
// don't exist on the given object. Each path is returned as an array of strings, which the caller will needs to format
// into whatever structure they're supposed to test.

function generateExistingPaths(object, numExistingPaths) {
  const paths = [];
  for (let i = 0; i < numExistingPaths; i++) {
    paths.push(getRandomPath(object));
  }
  return paths;
}

function generateMissingPaths(object, numMissingPaths) {
  const paths = [];
  for (let i = 0; i < numMissingPaths; i++) {
    // Start with a valid path...
    const path = getRandomPath(object);
    // And change one of the keys to something that [almost certainly] doesn't exist
    const indexToChange = Math.floor(Math.random() * path.length);
    path.splice(indexToChange, 1, `rand${Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)}`);

    paths.push(path);
  }
  return paths;
}

function generatePaths(object, numExistingPaths, numMissingPaths) {
  const existingPaths = generateExistingPaths(object, numExistingPaths);
  const missingPaths = generateMissingPaths(object, numMissingPaths);

  return shuffleArray([...existingPaths, ...missingPaths]);
}

module.exports = {
  generateExistingPaths,
  generateMissingPaths,
  generatePaths,
};
