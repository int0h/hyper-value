import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {read} from '../../read';

/**
 * Works similarly to `Array.slice` but accepts hyper-array.
 * It returns a hyper-value that always equals to result of applying `Array.slice` method to the original array.
 * @param hs HyperScope instance
 * @param hv hyper-array
 * @param start an index or hyper-value of one from which slice begins (updating this hyper-value leads to update of result hyper-value)
 * @param end an index or hyper-value of one from which slice begins (updating this hyper-value leads to update of result hyper-value)
 * @typeparam T type of hyper-array item
 */
export function slice<T>(hs: HyperScope, hv: HyperValue<T[]>, start?: number | HyperValue<number>, end?: number | HyperValue<number>): HyperValue<T[]> {
    return auto(hs, () => {
        const array = hv.$;
        const s = start === undefined ? 0 : read(start);
        const e = end === undefined ? array.length : read(end);
        return array.slice(s, e);
    });
}
