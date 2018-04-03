import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';

export interface Reducer<T, R> {
    (acc: R, value: T, index: number, array: T[]): R;
}

export function reduce<T>(hs: HyperScope, hv: HyperValue<T[]>, reducer: Reducer<T, T>): HyperValue<T>;

export function reduce<T, R>(hs: HyperScope, hv: HyperValue<T[]>, reducer: Reducer<T, R>, initial: R): HyperValue<R>;

/**
 * Works similarly to `Array.reduce` but accepts hyper-array.
 * It returns a hyper-value that always equals to result of applying `Array.reduce` method to the original array
 * @param hs HyperScope instance
 * @param hv hyper-array
 * @param reducer function to be called for each item
 * @typeparam T type of hyper-array item
 * @typeparam R type of reduce function results
 */
export function reduce<T, R>(hs: HyperScope, hv: HyperValue<T[]>, reducer: Reducer<T, R>, initial?: R): HyperValue<R> {
    return auto(hs, () => {
        return initial !== undefined
            ? hv.$.reduce(reducer, initial)
            : hv.$.reduce(reducer as any as Reducer<T, T>) as any as R;
    });
}
