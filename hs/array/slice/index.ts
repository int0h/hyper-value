import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';
import {read} from '../../read';

export function slice<T>(hs: HyperScope, hv: HyperValue<T[]>, start?: number | HyperValue<number>, end?: number | HyperValue<number>): HyperValue<T[]> {
    return auto(hs, () => {
        const array = hv.$;
        const s = start === undefined ? 0 : read(start);
        const e = end === undefined ? array.length : read(end);
        return array.slice(s, e);
    });
}
