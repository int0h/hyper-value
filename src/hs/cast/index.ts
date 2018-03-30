import {HyperValue} from '../../core/core';

export function cast<T>(hv: HyperValue<T> | T): HyperValue<T> {
    return hv instanceof HyperValue
        ? hv
        : new HyperValue(hv);
}
