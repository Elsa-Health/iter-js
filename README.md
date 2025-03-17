# iter-js

An ergonomic and performant JavaScript iteration library for functional style programming without the overhead.

[![jsr version](https://jsr.io/badges/@nod/iter-js)](https://jsr.io/@nod/iter-js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D%2022.0.0-brightgreen.svg)](https://nodejs.org/)
[![Test Coverage](https://github.com/YOUR_USERNAME/iter-js/raw/main/.github/badges/coverage.svg)](https://github.com/YOUR_USERNAME/iter-js/actions/workflows/publish.yaml)

## Features

- **Performance**: Optimized for both speed and memory efficiency
- **Lazy Evaluation**: Operations are only executed when needed
- **Chainable API**: Intuitive functional programming style
- **Type-Safe**: Written in TypeScript with full type definitions
- **Lightweight**: Zero dependencies, minimal footprint

## Installation

```bash
npx jsr add @nod/iter-js
# or
yarn dlx jsr add @nod/iter-js
# or
pnpm dlx jsr add @nod/iter-js
# or
bunx jsr add @nod/iter-js
```

## Usage

```typescript
import iter from "@nod/iter-js";

// Basic example
const result = iter([1, 2, 3, 4, 5])
  .map((x) => x * 2)
  .filter((x) => x > 5)
  .collect();

console.log(result); // [6, 8, 10]

// Working with objects
const users = [
  { id: 1, name: "Alice", age: 28 },
  { id: 2, name: "Bob", age: 32 },
  { id: 3, name: "Charlie", age: 22 },
];

const adultNames = iter(users)
  .filter((user) => user.age >= 25)
  .map((user) => user.name)
  .collect();

console.log(adultNames); // ["Alice", "Bob"]
```

## API Reference

### Creating Iterators

#### `iter(data)`

Creates an iterator wrapper with chainable methods.

- **data**: The array or iterable to iterate over

### Transformation Methods

#### `map(fn)`

Maps each element using the provided function.

```typescript
iter([1, 2, 3])
  .map((x) => x * 2)
  .collect(); // [2, 4, 6]
```

#### `filter(fn)`

Filters elements based on the provided predicate function.

```typescript
iter([1, 2, 3, 4])
  .filter((x) => x % 2 === 0)
  .collect(); // [2, 4]
```

### Subsetting Methods

#### `first(n)`

Takes the first n elements.

```typescript
iter([1, 2, 3, 4, 5]).first(3).collect(); // [1, 2, 3]
```

#### `last(n)`

Takes the last n elements.

```typescript
iter([1, 2, 3, 4, 5]).last(2).collect(); // [4, 5]
```

#### `reverse()`

Reverses the order of elements.

```typescript
iter([1, 2, 3]).reverse().collect(); // [3, 2, 1]
```

### Terminal Operations

#### `collect()`

Collects the results into an array, executing all operations in the chain.

```typescript
iter([1, 2, 3])
  .map((x) => x * 2)
  .collect(); // [2, 4, 6]
```

#### `find(predicate)`

Finds the first element that satisfies the predicate.

```typescript
iter([1, 2, 3, 4]).find((x) => x > 2); // 3
```

#### `findFirst()`

Gets the first element in the iterator.

```typescript
iter([1, 2, 3]).findFirst(); // 1
```

#### `forEach(fn)`

Executes a function for each element in the iterator.

```typescript
let sum = 0;
iter([1, 2, 3]).forEach((x) => {
  sum += x;
});
console.log(sum); // 6
```

#### `reduce(fn, initialValue)`

Reduces the iterator to a single value.

```typescript
iter([1, 2, 3]).reduce((acc, val) => acc + val, 0); // 6
```

#### `count()`

Counts the number of elements in the iterator.

```typescript
iter([1, 2, 3, 4])
  .filter((x) => x % 2 === 0)
  .count(); // 2
```

## Performance Comparison

`iter-js` is designed to be more efficient than native array methods, especially for complex operation chains.

### Time Performance

```
benchmark                           time/iter (avg)        iter/s      (min … max)           p75      p99     p995
----------------------------------- ----------------------------- --------------------- --------------------------
Native array methods                         6.9 ms         144.1 (  6.7 ms …  10.7 ms)   7.0 ms  10.7 ms  10.7 ms
Iter implementation                          6.2 ms         162.3 (  6.0 ms …   7.0 ms)   6.2 ms   7.0 ms   7.0 ms
Native array methods - long chain            9.8 ms         101.7 (  9.5 ms …  10.9 ms)  10.0 ms  10.9 ms  10.9 ms
Iter implementation - long chain             8.5 ms         118.2 (  8.3 ms …   9.3 ms)   8.5 ms   9.3 ms   9.3 ms
Native array methods - objects               1.2 ms         812.8 (  1.1 ms …   3.4 ms)   1.2 ms   1.7 ms   1.9 ms
Iter implementation - objects                1.2 ms         813.8 (  1.2 ms …   1.9 ms)   1.2 ms   1.8 ms   1.8 ms
```

### Memory Usage

```
=== MEMORY USAGE COMPARISON ===
Native implementation:
  Heap before: 14.97 MB total, 13.23 MB used
  Heap after:  51.44 MB total, 33.67 MB used
  Difference:  20.44 MB used

Iter implementation:
  Heap before: 51.44 MB total, 33.69 MB used
  Heap after:  57.92 MB total, 40.00 MB used
  Difference:  6.32 MB used

Memory savings: 14.12 MB
```

## Why Use iter-js?

- **Memory Efficiency**: Significantly lower memory usage compared to native array methods
- **Performance**: Faster execution, especially for longer operation chains
- **Cleaner Code**: Functional programming style with a fluent API
- **Type Safety**: Full TypeScript support with proper type inference

## Development

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run benchmarks (requires Deno)
deno run -A bench/bench.ts
deno run -A bench/memory.ts

# Build the library
pnpm build:all
```

## License

MIT
