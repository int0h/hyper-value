import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';

/**
 * Returns a number hyper-value always equal
 * to provided hyper-array length.
 * @param hs HyperScope instance
 * @param hv hyper-array, its length will be wrapped in hyper-value and be returned
 */
export function length(hs: HyperScope, hv: HyperValue<any[]>): HyperValue<number> {
    return auto(hs, () => {
        return hv.$.length;
    });
}
