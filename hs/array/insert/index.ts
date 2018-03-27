import {HyperValue} from '../../../core';

export function insert<T>(hv: HyperValue<T[]>, index: number, elems: T | T[]) {
    const array = hv.$;
    if (index < 0) {
        index = array.length + index;
    }
    const newArray = ([] as T[]).concat(
        array.slice(0, index),
        elems,
        array.slice(index)
    );
    hv.$ = newArray;
}
