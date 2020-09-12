# Benchmark of deep immutable setters

This project exercises several different utilities for deep-setting immutable data.

Note that these numbers ONLY reflect `set` operations. Many of these libraries also offer `get` functionality, so
the final bundle size will depend on your use cases. These are for reference only.

## Usage

To run this locally:

```shell script
yarn install;
yarn run benchmark;
```

## Results

Lower times are better .Last run on September 12, 2020.

| Library                                                                         |       Version | Bundle size                                                                                                                                     |   **Total time** | ["prop1", "prop2", "prop3"] | "prop1.prop2.prop3" | "prop1[prop2][prop3]" |
| :------------------------------------------------------------------------------ | ------------: | ----------------------------------------------------------------------------------------------------------------------------------------------- | ---------------: | --------------------------: | ------------------: | --------------------: |
| [Immer](https://immerjs.github.io/immer/)                                       |       `7.0.8` | [![gzip size](https://img.shields.io/bundlephobia/minzip/immer@7.0.8)](https://bundlephobia.com/result?p=immer@7.0.8)                           | **27.447886964** |                 8.907073234 |         9.249547088 |           9.291266642 |
| [Immutable.js](https://immutable-js.github.io/immutable-js/)                    | `4.0.0-rc.12` | [![gzip size](https://img.shields.io/bundlephobia/minzip/immutable@4.0.0-rc.12)](https://bundlephobia.com/result?p=immutable@4.0.0-rc.12)       |        (pending) |                   (pending) |           (pending) |             (pending) |
| [immutable-assign](https://github.com/engineforce/ImmutableAssign) (iassign.js) |       `2.1.4` | [![gzip size](https://img.shields.io/bundlephobia/minzip/immutable-assign@2.1.4)](https://bundlephobia.com/result?p=immutable-assign@2.1.4)     |        (pending) |                   (pending) |           (pending) |             (pending) |
| [lodash](https://lodash.com/) (setWith + clone)                                 |     `4.17.20` | [![gzip size](https://img.shields.io/bundlephobia/minzip/lodash@4.17.20)](https://bundlephobia.com/result?p=lodash@4.17.20)                     |  **4.662552397** |                  1.23424402 |         1.784842394 |           1.854285601 |
| [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)           |       `7.1.4` | [![gzip size](https://img.shields.io/bundlephobia/minzip/seamless-immutable@7.1.4)](https://bundlephobia.com/result?p=seamless-immutable@7.1.4) |        (pending) |                   (pending) |           (pending) |             (pending) |
| [tiny-immutable-set](https://github.com/spautz/tiny-immutable-set)              |       `0.1.0` | [![gzip size](https://img.shields.io/bundlephobia/minzip/tiny-immutable-set@0.1.0)](https://bundlephobia.com/result?p=tiny-immutable-set@0.1.0) |  **4.702447091** |                 2.191983945 |         1.447061770 |            1.63401376 |

## Organization

Each library has a file under `libraries/` which provides a callback for each scenario:

- `setWithString(object, path, value)`, where path looks like `"prop1.prop2.prop3"`
- `setWithArray(object, path, value)`, where path looks like `["prop1", "prop2", "prop3"]`
- `setWithArrayString(object, path, value)`, where path looks like `"prop1[prop2][prop3]"`

Each scenario type has a file under `scenarios/` which provides setup and teardown callbacks:

- `setup(numCasesToGenerate)` returns an array of `(object, path, value)` arguments to use for each test case
- `teardown(cases)` is available if you need it

`run-benchmark.js` runs everything based on the libraries and scenarios exported from each directory's `index.js`,
with some additional settings in `options.js`.
