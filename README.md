# tiny-immutable-set

A minimal, immutable, deep set utility for Javascript objects and arrays.

Inspired by, and based on, [NickGard's tiny-get](https://github.com/NickGard/tiny-get)

[![npm version](https://img.shields.io/npm/v/@spautz/node-library-template.svg)](https://www.npmjs.com/package/@spautz/node-library-template)
[![build status](https://github.com/spautz/package-template/workflows/CI/badge.svg)](https://github.com/spautz/package-template/actions)
[![test coverage](https://img.shields.io/coveralls/github/spautz/package-template/main.svg)](https://coveralls.io/github/spautz/package-template?branch=main)
[![dependencies status](https://img.shields.io/librariesio/release/npm/@spautz/node-library-template.svg)](https://libraries.io/github/spautz/package-template)
[![gzip size](https://img.shields.io/bundlephobia/minzip/@spautz/node-library-template.svg)](https://bundlephobia.com/package/@spautz/node-library-template@latest)

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
  [See full benchmark here.](./benchmark)
