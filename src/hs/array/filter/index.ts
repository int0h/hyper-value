import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {IteratorFn} from '../common';

export function filter<T>(hs: HyperScope, hv: HyperValue<T[]>, filterFn: IteratorFn<T, boolean>): HyperValue<T[]> {
    return auto(hs, () => {
        return hv.$.filter(filterFn);
    });
}
