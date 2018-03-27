import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {IteratorFn} from '../common';

export function some<T>(hs: HyperScope, hv: HyperValue<T[]>, mapFn: IteratorFn<T, boolean>): HyperValue<boolean> {
    return auto(hs, () => {
        return hv.$.some(mapFn);
    });
}
