import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';
import {proxy} from '../proxy';

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
