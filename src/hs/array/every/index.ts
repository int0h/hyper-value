import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {IteratorFn} from '../common';

/**
 * works similarly to `Array.every` but accepts hyper-array.
 * It returns a hyper-value of boolean
 * that always equals to result of applying `Array.every` method to the original array
 *
 * @param hs HyperScope instance
 * @param hv hyper-array
 * @param iterator function to be called for each item
 * @typeparam T type of hyper-array item
 */
export function every<T>(hs: HyperScope, hv: HyperValue<T[]>, iterator: IteratorFn<T, boolean>): HyperValue<boolean> {
    return auto(hs, () => {
        return hv.$.every(iterator);
    });
}
