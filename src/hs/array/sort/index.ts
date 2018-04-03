import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';

/**
 * works similarly to `Array.sort` but accepts hyper-array.
 * It returns a hyper-value of new sorted array
 * that always equals to result of applying `Array.sort` method to the original array.
 * It **does not** modify the original array.
 *
 * @param hs HyperScope instance
 * @param hv hyper-array
 * @param sortFn function to be used in sort (same as for `Array.sort`)
 * @typeparam T type of hyper-array item
 */
export function sort<T>(hs: HyperScope, hv: HyperValue<T[]>, sortFn?: (a: T, b: T) => number): HyperValue<T[]> {
    return auto(hs, () => {
        const array = hv.$.slice();
        array.sort(sortFn);
        return array;
    });
}
