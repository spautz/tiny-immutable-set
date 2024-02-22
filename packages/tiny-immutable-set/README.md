# tiny-immutable-set

A minimal, immutable, deep set utility for Javascript objects and arrays.

Inspired by, and based on, [NickGard's tiny-get](https://github.com/NickGard/tiny-get)

[![npm version](https://img.shields.io/npm/v/tiny-immutable-set.svg)](https://www.npmjs.com/package/tiny-immutable-set)
[![build status](https://github.com/spautz/tiny-immutable-set/workflows/CI/badge.svg)](https://github.com/spautz/tiny-immutable-set/actions)
[![test coverage](https://img.shields.io/coveralls/github/spautz/tiny-immutable-set/main.svg)](https://coveralls.io/github/spautz/tiny-immutable-set?branch=main)
[![dependencies status](https://img.shields.io/librariesio/release/npm/tiny-immutable-set.svg)](https://libraries.io/github/spautz/tiny-immutable-set)
[![gzip size](https://img.shields.io/bundlephobia/minzip/tiny-immutable-set.svg)](https://bundlephobia.com/package/tiny-immutable-set@latest)

## Usage

```typescript
import { set } from 'tiny-immutable-set';

const newState = set(state, 'deep.path', newValue);
```

The original `state` is not modified.

## Notes

- If you're using [lodash](https://lodash.com) then you don't need this: [see this thread for alternatives](https://github.com/lodash/lodash/issues/1696#issuecomment-328335502).
- Unlike most other setter utilities, this is slightly faster if you use a string for the path, instead of an array: `set(obj, "deep.path[123]", newVal)` instead of `set(obj, ["deep", "path", 123], newVal)`.
- The small bundle size of this library comes with a slight speed tradeoff. This library is a little slower than
  immutable-assign and immutable.js, but a little faster than Immer and seamless-immutable.
  [See full benchmark here.](../../demos/performance-benchmark)
