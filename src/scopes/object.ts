import {HyperValue} from '../core/core';
import {ProxyScope} from './proxy';

export class ObjectScope extends ProxyScope {
    prop<T extends object, K extends keyof T>(hv: HyperValue<T>, propertyName: K): HyperValue<T[K]> {
        return this.proxy(
            hv,
            () => hv.$[propertyName],
            value => {
                return {
                    ...hv.$ as object,
                    [propertyName]: value
                }
            }
        )
    }
}
