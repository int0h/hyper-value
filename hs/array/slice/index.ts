import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';
import {auto} from '../../auto';

export function slice<T>(hs: HyperScope, hv: HyperValue<T[]>, start?: number | HyperValue<number>, end?: number | HyperValue<number>): HyperValue<T[]> {
    return auto(hs, () => {
        const array = hv.$;
        const s = start === undefined ? 0 : this.read(start);
        const e = end === undefined ? array.length : this.read(end);
        return array.slice(s, e);
    });
}
