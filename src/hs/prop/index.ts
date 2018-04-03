import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';
import {proxy} from '../proxy';

/**
 * Allows to make hyper-value from property of another hyper-value (of object-like value).
 * This new property hyper-value will be up-to-date with the actual property and also writes to it
 * when it's changed.
 * It works similar to `auto(hs, () => hv.propertyName)` but also allows to write to source object.
 * When writing is not needed consider using `auto` instead of `prop`
 *
 * @param hs HyperScope instance
 * @param hv hyper-value object that owns the property
 * @param propertyName the name of the property
 * @returns property hyper-value
 * @typeparam T owner object type, it must be Object-like type (e.g. not `string` or `number`)
 * @typeparam K string type of key of the owner
 */
export function prop<T extends object, K extends keyof T>(hs: HyperScope, hv: HyperValue<T>, propertyName: K): HyperValue<T[K]> {
    return proxy(
        hs,
        hv,
        () => hv.$[propertyName],
        value => {
            return {
                ...hv.$ as object,
                [propertyName]: value
            } as T;
        }
    );
}
