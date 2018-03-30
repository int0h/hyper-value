import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';

export function concat<T1>(hs: HyperScope, hv1: HyperValue<T1[]>): HyperValue<T1[]>;
export function concat<T1, T2>(hs: HyperScope, hv1: HyperValue<T1[]>, hv2: HyperValue<T2[]>): HyperValue<(T1 | T2)[]>;
export function concat<T1, T2, T3>(hs: HyperScope, hv1: HyperValue<T1[]>, hv2: HyperValue<T2[]>, hv3: HyperValue<T2[]>): HyperValue<(T1 | T2 | T3)[]>;

export function concat(hs: HyperScope, ...hvs: HyperValue<any[]>[]): HyperValue<any[]> {
    return auto(hs, () => {
        const arrays = hvs.map(hv => hv.$);
        return Array.prototype.concat.apply([], [...arrays]);
    });
}
