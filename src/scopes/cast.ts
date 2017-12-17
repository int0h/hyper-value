import {HyperValue} from '../core/core';
import {BaseScope} from './base';

export class CastScope extends BaseScope {
    cast<T>(hv: HyperValue<T> | T): HyperValue<T> {
        return hv instanceof HyperValue
            ? hv
            : new HyperValue(hv);
    }

    read<T>(hv: HyperValue<T> | T): T {
        return hv instanceof HyperValue
            ? hv.g()
            : hv;
    }
}
