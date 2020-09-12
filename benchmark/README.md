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

Last run on (date goes here)

| Library                                                                         |       Version | Bundle size                                                                                                                         | Time (lower is better) |
| :------------------------------------------------------------------------------ | ------------: | ----------------------------------------------------------------------------------------------------------------------------------- | ---------------------: |
| [Immer](https://immerjs.github.io/immer/)                                       |       `7.0.8` | [![gzip size](https://img.shields.io/bundlephobia/minzip/immer)](https://bundlephobia.com/result?p=immer)                           |              (pending) |
| [Immutable.js](https://immutable-js.github.io/immutable-js/)                    | `4.0.0-rc.12` | [![gzip size](https://img.shields.io/bundlephobia/minzip/immutable)](https://bundlephobia.com/result?p=immutable)                   |              (pending) |
| [immutable-assign](https://github.com/engineforce/ImmutableAssign) (iassign.js) |       `2.1.4` | [![gzip size](https://img.shields.io/bundlephobia/minzip/immutable-assign)](https://bundlephobia.com/result?p=immutable-assign)     |              (pending) |
| [lodash](https://lodash.com/) (setWith + clone)                                 |     `4.17.20` | [![gzip size](https://img.shields.io/bundlephobia/minzip/lodash)](https://bundlephobia.com/result?p=lodash)                         |              (pending) |
| [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)           |       `7.1.4` | [![gzip size](https://img.shields.io/bundlephobia/minzip/seamless-immutable)](https://bundlephobia.com/result?p=seamless-immutable) |              (pending) |
| [tiny-immutable-set](https://github.com/spautz/tiny-immutable-set)              |       `0.1.0` | [![gzip size](https://img.shields.io/bundlephobia/minzip/tiny-immutable-set)](https://bundlephobia.com/result?p=tiny-immutable-set) |              (pending) |

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
