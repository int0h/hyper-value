import {HyperValue} from '../../../core';

/**
 * Removes items from array. it **modifies** provided hyper-array.
 * @param hv hyper-array containing items to remove
 * @param index index at which items will be removed (cannot be a hyper-value)
 * @param length number of items to be removed (cannot be a hyper-value)
 */
export function remove(hv: HyperValue<any[]>, index: number, length: number) {
    const array = hv.$;
    if (index < 0) {
        index = array.length + index;
    }
    const newArray = ([] as any[]).concat(array.slice(0, index), array.slice(index + length));
    hv.$ = newArray;
}
