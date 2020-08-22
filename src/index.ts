type RootObjectType = Record<string, any> | Array<any>;

const { isArray } = Array;

type CloneObject = (object: Record<string, any>) => Record<string, any>;
type CloneArray = (object: Array<any>) => Array<any>;
const clone: CloneObject | CloneArray = (objectOrArray: RootObjectType) =>
  isArray(objectOrArray) ? Array.from(objectOrArray) : Object.assign({}, objectOrArray);

const set = (
  root: RootObjectType,
  path: string | Array<string>,
  newValue: unknown,
): RootObjectType => {
  const newRoot: RootObjectType = clone(root);

  if (path in newRoot) {
    // Just set it directly: no need to loop
    newRoot[path as string] = newValue;
    return newRoot;
  }

  let currentParent = newRoot;
  let previousKey: string;
  let previousKeyIsArrayIndex: boolean = false;
  // This approach and regex come from https://github.com/NickGard/tiny-get
  if (isArray(path)) {
    path = "['" + path.join("']['") + "']";
  }
  path.replace(
    /\[\s*(['"])(.*?)\1\s*\]|^\s*(\w+)\s*(?=\.|\[|$)|\.\s*(\w*)\s*(?=\.|\[|$)|\[\s*(-?\d+)\s*\]/g,
    (wholeMatch, _quotationMark, quotedProp, firstLevel, namedProp, index) => {
      if (previousKey) {
        // Clone (or create) the object/array that we were just at: this lets us keep it attached to its parent.
        const previousValue = currentParent[previousKey];
        let newValue;
        if (previousValue) {
          newValue = clone(previousValue);
        } else if (previousKeyIsArrayIndex) {
          newValue = [];
        } else {
          newValue = {};
        }
        currentParent[previousKey] = newValue;

        // Now advance
        currentParent = newValue;
      }

      previousKey = quotedProp || firstLevel || namedProp || index;
      previousKeyIsArrayIndex = !!index;

      // This return makes the linter happy
      return wholeMatch;
    },
  );

  currentParent[previousKey!] = newValue;
  return newRoot;
};

export default set;
