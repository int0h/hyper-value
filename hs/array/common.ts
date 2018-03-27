export interface IteratorFn<T, R> {
    (value: T, index: number, array: T[]): R;
}
