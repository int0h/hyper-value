import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {IteratorFn} from '../common';

/**
 * Works similarly to `Array.map` but accepts hyper-array.
 * It returns a hyper-value of new array of new type (new type is the result type of map function)
 * that always equals to result of applying `Array.map` method to the original array
 * It takes hyper-value of `T[]` and return a hyper-value of `R[]`, while map function is `(item: T) => R`
 * @param hs HyperScope instance
 * @param hv hyper-array
 * @param mapFn function to be called for each item
 * @typeparam T type of hyper-array item
 * @typeparam R type of map function results
 */
export function map<T, R>(hs: HyperScope, hv: HyperValue<T[]>, mapFn: IteratorFn<T, R>): HyperValue<R[]> {
    return auto(hs, () => {
        return hv.$.map(mapFn);
    });
}
