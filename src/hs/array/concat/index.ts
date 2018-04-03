import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';

export function concat<T1>(hs: HyperScope, hv1: HyperValue<T1[]>): HyperValue<T1[]>;
export function concat<T1, T2>(hs: HyperScope, hv1: HyperValue<T1[]>, hv2: HyperValue<T2[]>): HyperValue<(T1 | T2)[]>;
export function concat<T1, T2, T3>(hs: HyperScope, hv1: HyperValue<T1[]>, hv2: HyperValue<T2[]>, hv3: HyperValue<T2[]>): HyperValue<(T1 | T2 | T3)[]>;

/**
 * works similarly to `Array.concat` but accepts hyper-arrays.
 * It takes a set of hyper-arrays and return a new hyper-array which is always
 * equal to concat'ed source ones.
 *
 * @param hs HyperScope instance
 * @param hvs hyper-arrays
 */
export function concat(hs: HyperScope, ...hvs: HyperValue<any[]>[]): HyperValue<any[]> {
    return auto(hs, () => {
        const arrays = hvs.map(hv => hv.$);
        return Array.prototype.concat.apply([], [...arrays]);
    });
}
