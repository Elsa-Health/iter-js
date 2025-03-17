// bench/memory.ts
import { iter } from "../src/index.ts";

// Helper to pause execution, this should help pause between operations (right??)
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Create a large array
const size = 1_000_000;
const data = Array.from({ length: size }, (_, i) => i);

// Test native array methods
async function testNative() {
  // Force garbage collection if possible
  if (typeof Deno.gc === "function") {
    Deno.gc();
  }

  await sleep(1000); // Allow memory to stabilize

  const beforeMem = Deno.memoryUsage();
  console.log("Memory before native operations:", beforeMem);
  const nativeResult = data
    .map((x) => x * 2)
    .map((x) => x * 2)
    .filter((x) => x % 3 === 0);
  const afterMem = Deno.memoryUsage();
  console.log("Memory after native operations:", afterMem);

  return { result: nativeResult, before: beforeMem, after: afterMem };
}

// Test iter implementation
async function testIter() {
  // Force garbage collection if possible
  if (typeof Deno.gc === "function") {
    Deno.gc();
  }

  await sleep(1000); // Allow memory to stabilize

  const beforeMem = Deno.memoryUsage();
  console.log("Memory before iter operations:", beforeMem);
  const iterResult = iter(data)
    .map((x) => x * 2)
    .map((x) => x * 2)
    .filter((x) => x % 3 === 0)
    .collect();
  const afterMem = Deno.memoryUsage();
  console.log("Memory after iter operations:", afterMem);

  return { result: iterResult, before: beforeMem, after: afterMem };
}

// Run tests sequentially
(async () => {
  const nativeData = await testNative();
  await sleep(2000); // Longer pause between tests
  const iterData = await testIter();

  // Verify both implementations produce the same result
  console.log(
    "Results match:",
    JSON.stringify(nativeData.result) === JSON.stringify(iterData.result)
  );

  console.log("\n=== MEMORY USAGE COMPARISON ===");
  console.log("Native implementation:");
  console.log(
    `  Heap before: ${(nativeData.before.heapTotal / 1024 / 1024).toFixed(
      2
    )} MB total, ${(nativeData.before.heapUsed / 1024 / 1024).toFixed(
      2
    )} MB used`
  );
  console.log(
    `  Heap after:  ${(nativeData.after.heapTotal / 1024 / 1024).toFixed(
      2
    )} MB total, ${(nativeData.after.heapUsed / 1024 / 1024).toFixed(
      2
    )} MB used`
  );
  console.log(
    `  Difference:  ${(
      (nativeData.after.heapUsed - nativeData.before.heapUsed) /
      1024 /
      1024
    ).toFixed(2)} MB used`
  );

  console.log("\nIter implementation:");
  console.log(
    `  Heap before: ${(iterData.before.heapTotal / 1024 / 1024).toFixed(
      2
    )} MB total, ${(iterData.before.heapUsed / 1024 / 1024).toFixed(2)} MB used`
  );
  console.log(
    `  Heap after:  ${(iterData.after.heapTotal / 1024 / 1024).toFixed(
      2
    )} MB total, ${(iterData.after.heapUsed / 1024 / 1024).toFixed(2)} MB used`
  );
  console.log(
    `  Difference:  ${(
      (iterData.after.heapUsed - iterData.before.heapUsed) /
      1024 /
      1024
    ).toFixed(2)} MB used`
  );

  console.log(
    `\nMemory savings: ${(
      (nativeData.after.heapUsed -
        nativeData.before.heapUsed -
        (iterData.after.heapUsed - iterData.before.heapUsed)) /
      1024 /
      1024
    ).toFixed(2)} MB`
  );
})();
