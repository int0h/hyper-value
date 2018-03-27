import {HyperValue} from '../../core/core';

export function read<T>(hv: HyperValue<T> | T): T {
    return hv instanceof HyperValue
        ? hv.g()
        : hv;
}
