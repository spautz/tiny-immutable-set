# Benchmark of deep immutable setters

These results come from [immutable-assign's benchmarking setup](https://github.com/engineforce/ImmutableAssign#performance),
but only the "set"/"write" times are listed here.

Many of these libraries also offer `get` functionality, so the final bundle size will depend on your use case.

## Results

Lower times are better. Last run on September 13, 2020.

| Library                                                                         |       Version | Bundle size                                                                                                                                     | Total time (ms) |
| :------------------------------------------------------------------------------ | ------------: | ----------------------------------------------------------------------------------------------------------------------------------------------- | --------------: |
| [Immer](https://immerjs.github.io/immer/)                                       |       `7.0.8` | [![gzip size](https://img.shields.io/bundlephobia/minzip/immer@7.0.8)](https://bundlephobia.com/result?p=immer@7.0.8)                           |           28977 |
| [Immutable.js](https://immutable-js.github.io/immutable-js/)                    | `4.0.0-rc.12` | [![gzip size](https://img.shields.io/bundlephobia/minzip/immutable@4.0.0-rc.12)](https://bundlephobia.com/result?p=immutable@4.0.0-rc.12)       |             871 |
| [immutable-assign](https://github.com/engineforce/ImmutableAssign) (iassign.js) |       `2.1.4` | [![gzip size](https://img.shields.io/bundlephobia/minzip/immutable-assign@2.1.4)](https://bundlephobia.com/result?p=immutable-assign@2.1.4)     |            1348 |
| [lodash](https://lodash.com/) (setWith + clone)                                 |     `4.17.20` | [![gzip size](https://img.shields.io/bundlephobia/minzip/lodash@4.17.20)](https://bundlephobia.com/result?p=lodash@4.17.20)                     |            1492 |
| [seamless-immutable](https://github.com/rtfeldman/seamless-immutable)           |       `7.1.4` | [![gzip size](https://img.shields.io/bundlephobia/minzip/seamless-immutable@7.1.4)](https://bundlephobia.com/result?p=seamless-immutable@7.1.4) |           16207 |
| [tiny-immutable-set](https://github.com/spautz/tiny-immutable-set)              |       `0.1.0` | [![gzip size](https://img.shields.io/bundlephobia/minzip/tiny-immutable-set@0.1.0)](https://bundlephobia.com/result?p=tiny-immutable-set@0.1.0) |            1488 |

## To run benchmarks yourself

The easiest way to run the benchmarks is to use the immutable-assign repo directly:

1. Clone https://github.com/engineforce/ImmutableAssign
2. Copy/paste the code from [`./tiny-immutable-set-benchmark.js`](tiny-immutable-set-benchmark.js) to `debug/benchmarks.js` in your clone of immutable-assign, following the pattern in that file
3. In your immutable-assign clone, `npm install tiny-immutable-set`
4. In your immutable-assign clone, upgrade any other immutable libraries you wish to test, since a few are outdated in that repo
5. In your immutable-assign clone, `npm run benchmarks`

This can also be used with [immutable-benchmarks-lib](https://github.com/conordickinson/immutable-benchmarks), if you prefer.
