import { expect, test } from "vitest";
import { iter } from "..";

function doubleNumber(num: number): number {
  return num + num;
}

function doublePair(pair: [number, number]): [number, number] {
  return [pair[0] + pair[0], pair[1] + pair[1]];
}

function sum(nums: number[]): number {
  return nums.reduce((prev, cur) => prev + cur, 0);
}

function isMultipleOfThree(num: number): boolean {
  return num % 3 === 0;
}

function stringify(input: any): string {
  return String(input);
}

test("Can chain map operations and collect results", () => {
  const data = [1, 2, 3, 4, 5, 6];
  const res = iter(data).map(doubleNumber).map(stringify).collect();
  expect(res).toEqual(["2", "4", "6", "8", "10", "12"]);
});

test("Lazy evaluation with filter", () => {
  let data = [1, 2, 3, 4, 5, 6];
  const res = iter(data)
    .map(doubleNumber)
    .filter(isMultipleOfThree)
    .map(stringify)
    .collect();
  expect(res).toEqual(["6", "12"]);
});

test("first and last methods", () => {
  let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const firstThree = iter(data).map(doubleNumber).first(3).collect();
  expect(firstThree).toEqual([2, 4, 6]);

  const lastTwo = iter(data).map(doubleNumber).last(2).collect();
  expect(lastTwo).toEqual([18, 20]);
});

test("find method", () => {
  let data = [1, 2, 3, 4, 5, 6];
  const found = iter(data)
    .map(doubleNumber)
    .find((x) => x > 8);
  expect(found).toEqual(10);
});

test("forEach method", () => {
  let data = [1, 2, 3];
  let sum = 0;
  iter(data).forEach((x) => {
    sum += x;
  });
  expect(sum).toEqual(6);
});

test("reduce method", () => {
  let data = [1, 2, 3, 4, 5];
  const total = iter(data).reduce((acc, val) => acc + val, 0);
  expect(total).toEqual(15);
});

/**
 * Stress testing the iter implementation and making sure it performs better than default .map .filter methods.
 */
test("Performance comparison with native array methods", () => {
  // Create a large array
  const size = 1_000_000;
  const largeArray = Array.from({ length: size }, (_, i) => i);

  // Test native array methods
  console.time("Native array methods");
  const nativeStartTime = performance.now();
  const nativeResult = largeArray
    .map((x) => x * 2)
    .map((x) => x * 2)
    .map((x) => x * 2)
    .filter((x) => x % 3 === 0)
    .map((x) => x + 1);
  const nativeEndTime = performance.now();
  const nativeDuration = nativeEndTime - nativeStartTime;
  console.timeEnd("Native array methods");

  // Test iter implementation
  console.time("iter implementation");

  const iterResultInit = iter(largeArray)
    .map((x) => x * 2)
    .map((x) => x * 2)
    .map((x) => x * 2)
    .filter((x) => x % 3 === 0)
    .map((x) => x + 1);

  const iterStartTime = performance.now();
  const iterResult = iterResultInit.collect();
  const iterEndTime = performance.now();
  const iterDuration = iterEndTime - iterStartTime;
  console.timeEnd("iter implementation");

  // Verify both implementations produce the same result
  expect(iterResult).toEqual(nativeResult);

  // Verify iter implementation is faster
  expect(iterDuration).toBeLessThan(nativeDuration);
  // Log performance comparison
  console.log(`Native duration: ${nativeDuration.toFixed(2)}ms`);
  console.log(`Iter duration: ${iterDuration.toFixed(2)}ms`);
  console.log(
    `Improvement: ${(
      ((nativeDuration - iterDuration) / nativeDuration) *
      100
    ).toFixed(2)}%`
  );
});

test("Performance comparison with objects", () => {
  // Create a large array of user profiles
  const size = 100_000;
  const userProfiles = Array.from({ length: size }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    age: 20 + (i % 30),
    active: i % 3 === 0,
    email: `user${i}@example.com`,
  }));

  // Test native array methods
  console.time("Native array methods - objects");
  const nativeStartTime = performance.now();
  const nativeResult = userProfiles
    .map((user) => ({ ...user, age: user.age + 1 }))
    .filter((user) => user.active)
    .map((user) => ({ ...user, email: user.email.toUpperCase() }));
  const nativeEndTime = performance.now();
  const nativeDuration = nativeEndTime - nativeStartTime;
  console.timeEnd("Native array methods - objects");

  // Test iter implementation
  console.time("iter implementation - objects");

  const iterResultInit = iter(userProfiles)
    .map((user) => ({ ...user, age: user.age + 1 }))
    .filter((user) => user.active)
    .map((user) => ({ ...user, email: user.email.toUpperCase() }));

  const iterStartTime = performance.now();
  const iterResult = iterResultInit.collect();
  const iterEndTime = performance.now();
  const iterDuration = iterEndTime - iterStartTime;
  console.timeEnd("iter implementation - objects");

  // Verify both implementations produce the same result
  expect(iterResult).toEqual(nativeResult);

  // Verify iter implementation is faster
  expect(iterDuration).toBeLessThan(nativeDuration);
  // Log performance comparison
  console.log(`Native duration (objects): ${nativeDuration.toFixed(2)}ms`);
  console.log(`Iter duration (objects): ${iterDuration.toFixed(2)}ms`);
  console.log(
    `Improvement: ${(
      ((nativeDuration - iterDuration) / nativeDuration) *
      100
    ).toFixed(2)}%`
  );
});
