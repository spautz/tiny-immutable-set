const TEST_OBJECT_BREADTH = 10;

// Create a massive test object: An object of arrays of objects, with 10 items at each level.
// It looks vaguely like: {
//    prop1: [
//      {
//        deep1: 100,
//        deep2: 101,
//        deep3: 102,
//        ...
//      }, {
//        deep1: 103,
//        deep2: 104,
//        deep3: 105,
//        ...
//      },
//      ...
//    ],
//    prop2: [
//      {
//        deep1: 123,
//        deep2: 124,
//        deep3: 125,
//        ...
//      },
//      ...
//    ],
//    prop3: [ ... ],
//    ...
//  }
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

module.exports = TEST_OBJECT;
