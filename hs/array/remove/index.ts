import {HyperValue} from '../../../core';

export function remove(hv: HyperValue<any[]>, index: number, length: number) {
    const array = hv.$;
    if (index < 0) {
        index = array.length + index;
    }
    const newArray = ([] as any[]).concat(array.slice(0, index), array.slice(index + length));
    hv.$ = newArray;
}
