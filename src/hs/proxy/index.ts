import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';
import {auto} from '../auto';
import {bind} from '../bind';

/**
 * Proxies access to a hyper-value by creating a new one.
 * e.g. to make a hyper-value that proxy string hyper-value to number one you can write
 * `proxy(hs, hv, str => Number(str), num => String(num))`
 * @param hs HyperScope instance
 * @param hv hyper-value to be proxied
 * @param getter transform inner value into outer value
 * @param setter transform outer value into inner value
 * @typeparam I inner value type
 * @typeparam O outer value type
 */
export function proxy<I, O>(
    hs: HyperScope,
    hv: HyperValue<I>,
    getter: (innerValue: I) => O,
    setter?: (outerValue: O) => I
): HyperValue<O> {
    const result = auto(hs, () => getter(hv.$));

    if (setter) {
        bind(hs, hv, () => setter(result.$), false);
    }

    return result;
}
