import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';
import {bind} from '../bind';

/**
 * takes a function which calculates some value out of some hyper-values
 * and return a new hyper-value equals to calculated expression.
 * Furthermore it remembers all hyper-values used in the function
 * and subscribe to them. Because of that, the returned hyper-value is always relevant.
 * @param hs - HyperScope instance
 * @param fn - a function that calculates the value
 */
export function auto<T>(hs: HyperScope, fn: () => T): HyperValue<T> {
    const hv = new HyperValue(null as any as T);
    bind(hs, hv, fn, true);
    return hv;
}
