import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {IteratorFn} from '../common';

export function find<T>(hs: HyperScope, hv: HyperValue<T[]>, fn: IteratorFn<T, boolean>): HyperValue<T | null> {
    return auto(hs, () => {
        const array = hv.$;
        for (let i = 0; i < array.length; i++) {
            if (fn(array[i], i, array)) {
                return array[i];
            }
        }
        return null;
    });
}
