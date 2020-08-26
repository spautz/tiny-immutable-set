# tiny-immutable-set

A minimal, immutable, deep set utility for Javascript objects and arrays.

Inspired by, and based on, [NickGard's tiny-get](https://github.com/NickGard/tiny-get)

[![npm version](https://img.shields.io/npm/v/tiny-immutable-set.svg)](https://www.npmjs.com/package/tiny-immutable-set)
[![build status](https://img.shields.io/travis/com/spautz/tiny-immutable-set.svg)](https://travis-ci.com/spautz/tiny-immutable-set)
[![dependencies status](https://img.shields.io/badge/dependencies-none-green.svg)](https://david-dm.org/spautz/tiny-immutable-set)
[![gzip size](https://img.badgesize.io/https://unpkg.com/tiny-immutable-set@latest/dist/tiny-immutable-set.cjs.production.min.js?compression=gzip)](https://bundlephobia.com/result?p=tiny-immutable-set)
[![test coverage](https://img.shields.io/coveralls/github/spautz/tiny-immutable-set.svg)](https://coveralls.io/github/spautz/tiny-immutable-set)

## Usage

```typescript
import { set } from 'tiny-immutable-set';

const newState = set(state, 'deep.path', newValue);
```

The original `state` is not modified.

## Notes

- If you're using [lodash](https://lodash.com) then you don't need this: [see this thread for alternatives](https://github.com/lodash/lodash/issues/1696#issuecomment-328335502).

- The small bundle size of this library comes with a slight speed tradeoff. This library is a little slower than
  immutable-assign and immutable.js, but a little faster than Immer and seamless-immutable. [See full benchmark here.](./benchmark)
