import {HyperValue} from '../core/core';
import {AutoScope} from './auto';

export class ProxyScope extends AutoScope {
    proxy<I, O>(
        hv: HyperValue<I>,
        getter: (innerValue: I) => O,
        setter?: (outerValue: O) => I
    ): HyperValue<O> {
        const result = this.auto(() => getter(hv.$));

        if (setter) {
            this.bind(hv, () => setter(result.$), false);
        }

        return result;
    }
}
