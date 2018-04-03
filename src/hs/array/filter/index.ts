import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {IteratorFn} from '../common';

/**
 * works similarly to `Array.filter` but accepts hyper-array.
 * It returns a hyper-value of new array of same type
 * that always equals to result of applying `Array.filter` method to the original array
 *
 * @param hs HyperScope instance
 * @param hv hyper-array
 * @param iterator function to be called for each item
 */
export function filter<T>(hs: HyperScope, hv: HyperValue<T[]>, filterFn: IteratorFn<T, boolean>): HyperValue<T[]> {
    return auto(hs, () => {
        return hv.$.filter(filterFn);
    });
}
