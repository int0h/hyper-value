import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {IteratorFn} from '../common';

/**
 * Works similarly to `Array.findIndex` (es6). It takes hyper-array
 * and a function that called with each item. It returns a hyper-value that equals to the id
 * of the first element in the array that satisfies the provided testing function. If no item is found
 * returned hyper-value equals to `-1`.
 * @param hs HyperScope instance
 * @param hv hyper-array to search in
 * @param fn search function
 * @returns new hyper-value equals to found id
 */
export function findIndex<T>(hs: HyperScope, hv: HyperValue<T[]>, fn: IteratorFn<T, boolean>): HyperValue<number | null> {
    return auto(hs, () => {
        const array = hv.$;
        for (let i = 0; i < array.length; i++) {
            if (fn(array[i], i, array)) {
                return i;
            }
        }
        return -1;
    });
}
