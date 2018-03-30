import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';

export function length(hs: HyperScope, hv: HyperValue<any[]>): HyperValue<number> {
    return auto(hs, () => {
        return hv.$.length;
    });
}
