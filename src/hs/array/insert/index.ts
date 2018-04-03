import {HyperValue} from '../../../core';

/**
 * Inserts new items into array. It **modifies** provided hyper-array.
 * @param hv hyper-array to insert new items
 * @param index index at which new items will be inserted (cannot be a hyper-value)
 * @param elems new items to be inserted (cannot be a hyper-value)
 */
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
