import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';
import {auto} from '../auto';
import {bind} from '../bind';

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
