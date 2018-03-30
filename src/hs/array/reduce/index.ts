import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';

export interface Reducer<T, R> {
    (acc: R, value: T, index: number, array: T[]): R;
}

export function reduce<T>(hs: HyperScope, hv: HyperValue<T[]>, reducer: Reducer<T, T>): HyperValue<T>;

export function reduce<T, R>(hs: HyperScope, hv: HyperValue<T[]>, reducer: Reducer<T, R>, initial: R): HyperValue<R>;

export function reduce<T, R>(hs: HyperScope, hv: HyperValue<T[]>, reducer: Reducer<T, R>, initial?: R): HyperValue<R> {
    return auto(hs, () => {
        return initial !== undefined
            ? hv.$.reduce(reducer, initial)
            : hv.$.reduce(reducer as any as Reducer<T, T>) as any as R;
    });
}
