// bench/bench.ts
import { iter } from "../src/index.ts";

// Helper function to create test data
function createTestData(size: number): number[] {
  return Array.from({ length: size }, (_, i) => i);
}

// Benchmark for native array methods
Deno.bench("Native array methods", () => {
  const data = createTestData(100_000);
  const result = data
    .map((x) => x * 2)
    .map((x) => x * 2)
    .map((x) => x * 2)
    .filter((x) => x % 3 === 0)
    .map((x) => x + 1);
});

// Benchmark for iter implementation
Deno.bench("Iter implementation", () => {
  const data = createTestData(100_000);
  const result = iter(data)
    .map((x) => x * 2)
    .map((x) => x * 2)
    .map((x) => x * 2)
    .filter((x) => x % 3 === 0)
    .map((x) => x + 1)
    .collect();
});

// Benchmark for long chains - native
Deno.bench("Native array methods - long chain", () => {
  const data = createTestData(50_000);
  let result = [...data];
  for (let i = 0; i < 20; i++) {
    result = result.map((x) => x + 1);
  }
});

// Benchmark for long chains - iter
Deno.bench("Iter implementation - long chain", () => {
  const data = createTestData(50_000);
  let chain = iter(data);
  for (let i = 0; i < 20; i++) {
    chain = chain.map((x) => x + 1);
  }
  const result = chain.collect();
});

// Benchmark for object operations - native
Deno.bench("Native array methods - objects", () => {
  const data = Array.from({ length: 10_000 }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    age: 20 + (i % 30),
    active: i % 3 === 0,
    email: `user${i}@example.com`,
  }));

  const result = data
    .map((user) => ({ ...user, age: user.age + 1 }))
    .filter((user) => user.active)
    .map((user) => ({ ...user, email: user.email.toUpperCase() }));
});

// Benchmark for object operations - iter
Deno.bench("Iter implementation - objects", () => {
  const data = Array.from({ length: 10_000 }, (_, i) => ({
    id: i,
    name: `User ${i}`,
    age: 20 + (i % 30),
    active: i % 3 === 0,
    email: `user${i}@example.com`,
  }));

  const result = iter(data)
    .map((user) => ({ ...user, age: user.age + 1 }))
    .filter((user) => user.active)
    .map((user) => ({ ...user, email: user.email.toUpperCase() }))
    .collect();
});
