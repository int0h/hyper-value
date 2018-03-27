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
                } as T;
            }
        );
    }

    setProp<T>(hv: HyperValue<T[]>, propertyName: number, value: T): void;
    setProp<T extends object, K extends keyof T>(hv: HyperValue<T>, propertyName: K, value: T[K]): void;
    setProp<T extends object, K extends keyof T>(hv: HyperValue<T>, propertyName: K, value: T[K]) {
        const obj = hv.$;
        obj[propertyName] = value;
        hv.$ = obj;
    }

    getProp<T>(hv: HyperValue<T[]>, propertyName: number): T;
    getProp<T extends object, K extends keyof T>(hv: HyperValue<T>, propertyName: K): T[K];
    getProp<T extends object, K extends keyof T>(hv: HyperValue<T>, propertyName: K): T[K] {
        return hv.$[propertyName];
    }
}
