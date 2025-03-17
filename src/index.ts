/**
 * Type definitions for operations
 */
type MapOperation<T, U> = {
  type: "map";
  fn: (item: T) => U;
};

type FilterOperation<T> = {
  type: "filter";
  fn: (item: T) => boolean;
};

type Operation<T, U> = MapOperation<T, U> | FilterOperation<T>;

/**
 * Creates an iterator wrapper with chainable methods for functional programming
 * @param data - The data to iterate over
 * @returns An iterator object with chainable methods
 */
export function iter<T>(data: T[]): IterWrapper<T, T> {
  return new IterWrapper<T, T>(data);
}

/**
 * Iterator wrapper that provides functional programming methods
 * All operations are lazy until collect() is called
 */
export class IterWrapper<T, U> {
  private source: T[];
  private operations: Operation<any, any>[] = [];

  constructor(source: T[], operations: Operation<any, any>[] = []) {
    this.source = source;
    this.operations = operations;
  }

  /**
   * Maps each element using the provided function
   * @param fn - The mapping function
   * @returns A new iterator with the mapping operation added to the chain
   */
  map<V>(fn: (item: U) => V): IterWrapper<T, V> {
    return new IterWrapper<T, V>(this.source, [
      ...this.operations,
      { type: "map", fn },
    ]);
  }

  /**
   * Filters elements using the provided predicate
   * @param fn - The filter function
   * @returns A new iterator with the filter operation added to the chain
   */
  filter(fn: (item: U) => boolean): IterWrapper<T, U> {
    return new IterWrapper<T, U>(this.source, [
      ...this.operations,
      { type: "filter", fn },
    ]);
  }

  /**
   * Takes the first n elements
   * @param n - Number of elements to take
   * @returns A new iterator that will only process the first n elements
   */
  first(n: number): IterWrapper<T, U> {
    return new IterWrapper<T, U>(this.source.slice(0, n), this.operations);
  }

  /**
   * Returns the last n elements
   * @param n - Number of elements to take from the end
   * @returns A new iterator that will only process the last n elements
   */
  last(n: number): IterWrapper<T, U> {
    const sourceLength = this.source.length;
    const startIndex = Math.max(0, sourceLength - n);
    return new IterWrapper<T, U>(
      this.source.slice(startIndex),
      this.operations
    );
  }

  /**
   * Process a single item through all operations
   * @param item - The item to process
   * @returns The processed item or undefined if filtered out
   */
  private processItem(item: T): U | undefined {
    let result: any = item;

    for (const op of this.operations) {
      if (op.type === "filter") {
        if (!op.fn(result)) {
          return undefined; // Item filtered out
        }
      } else if (op.type === "map") {
        result = op.fn(result);
      }
    }

    return result;
  }

  /**
   * Collects the results into an array, executing all operations in the chain
   * This is where the actual processing happens
   * @returns The final array of results
   */
  collect(): U[] {
    const result: U[] = [];

    // Process each source item through the entire operation chain
    for (let i = 0; i < this.source.length; i++) {
      const processed = this.processItem(this.source[i]);
      if (processed !== undefined) {
        result.push(processed);
      }
    }

    return result;
  }

  /**
   * Finds the first element that satisfies the predicate
   * @param predicate - The predicate function
   * @returns The first matching element or undefined
   */
  find(predicate: (item: U) => boolean): U | undefined {
    for (let i = 0; i < this.source.length; i++) {
      const processed = this.processItem(this.source[i]);
      if (processed !== undefined && predicate(processed)) {
        return processed;
      }
    }

    return undefined;
  }

  /**
   * Gets the first element in the iterator
   * @returns The first element or undefined if empty
   */
  findFirst(): U | undefined {
    if (this.source.length === 0) return undefined;

    return this.processItem(this.source[0]);
  }

  /**
   * Executes a function for each element in the iterator
   * @param fn - The function to execute
   */
  forEach(fn: (item: U) => void): void {
    for (let i = 0; i < this.source.length; i++) {
      const processed = this.processItem(this.source[i]);
      if (processed !== undefined) {
        fn(processed);
      }
    }
  }

  /**
   * Reduces the iterator to a single value
   * @param fn - The reducer function
   * @param initialValue - The initial value
   * @returns The reduced value
   */
  reduce<V>(fn: (acc: V, item: U) => V, initialValue: V): V {
    let acc = initialValue;

    this.forEach((item) => {
      acc = fn(acc, item);
    });

    return acc;
  }

  /**
   * Counts the number of elements in the iterator
   * @returns The count of elements after applying all operations
   */
  count(): number {
    return this.collect().length;
  }

  /**
   * Creates a new iterator with the elements in reverse order
   * @returns A new iterator with reversed elements
   */
  reverse(): IterWrapper<T, U> {
    return new IterWrapper<T, U>([...this.source].reverse(), this.operations);
  }
}

export default iter;
