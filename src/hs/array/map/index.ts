import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {IteratorFn} from '../common';

export function map<T, R>(hs: HyperScope, hv: HyperValue<T[]>, mapFn: IteratorFn<T, R>): HyperValue<R[]> {
    return auto(hs, () => {
        return hv.$.map(mapFn);
    });
}
