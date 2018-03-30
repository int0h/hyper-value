import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';

export function sort<T>(hs: HyperScope, hv: HyperValue<T[]>, sortFn?: (a: T, b: T) => number): HyperValue<T[]> {
    return auto(hs, () => {
        const array = hv.$.slice();
        array.sort(sortFn);
        return array;
    });
}
