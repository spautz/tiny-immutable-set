const { isArray } = Array;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ObjectOrArray = Record<string, any> | Array<any>;
const clone = (objectOrArray: ObjectOrArray): ObjectOrArray =>
  isArray(objectOrArray) ? Array.from(objectOrArray) : Object.assign({}, objectOrArray);

// This approach and regex come from https://github.com/NickGard/tiny-get
const pathSeperatorRegex =
  /\[\s*(['"])(.*?)\1\s*\]|^\s*(\w+)\s*(?=\.|\[|$)|\.\s*(\w*)\s*(?=\.|\[|$)|\[\s*(-?\d+)\s*\]/g;

const set = <T extends ObjectOrArray = ObjectOrArray>(
  root: T,
  path: string | number | Array<string | number>,
  newValue: unknown,
): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newRoot: any = clone(root);

  if (typeof path === 'number' || (!isArray(path) && path in newRoot)) {
    // Just set it directly: no need to loop
    newRoot[path as string] = newValue;
    return newRoot;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let currentParent: any = newRoot;
  let previousKey: string;
  let previousKeyIsArrayIndex = false;
  // This approach and regex come from https://github.com/NickGard/tiny-get
  if (isArray(path)) {
    path = "['" + path.join("']['") + "']";
  }
  path.replace(
    pathSeperatorRegex,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
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
      // return wholeMatch;
    },
  );

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  currentParent[previousKey!] = newValue;
  return newRoot;
};

export { set };
