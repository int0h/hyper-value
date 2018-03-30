import {HyperValue} from '../../core/core';
import {HyperScope} from '../../scopes';

import {watch} from '../watch';
import {unwatch} from '../unwatch';

export type Waiter<T, V extends T> = V | ((value: T) => boolean | void);

function matchWaiter<T, V extends T>(waiter: Waiter<T, V>, value: T): boolean {
    if (typeof waiter === 'function') {
        if (waiter(value)) {
            return true;
        }
        return false;
    }
    return waiter === value;
}

function notUndefined(value: any) {
    return value !== undefined;
}

export function wait<V>(hs: HyperScope, hv: HyperValue<V | undefined>): Promise<HyperValue<V>>;
export function wait<V extends T, T = V | undefined>(hs: HyperScope, hv: HyperValue<T>, resolveOn: Waiter<T, V>, rejectOn?: Waiter<T, V>): Promise<HyperValue<V>>;
export function wait<V extends T, T = V | undefined>(hs: HyperScope, hv: HyperValue<T>, resolveOn: Waiter<T, V> = notUndefined, rejectOn?: Waiter<T, V>): Promise<HyperValue<V>> {
    return new Promise((resolve, reject) => {
        const watcherId = watch(hs, hv, value => {
            if (matchWaiter(resolveOn, value)) {
                unwatch(hs, hv, watcherId);
                resolve(hv as HyperValue<V>);
                return;
            }

            if (rejectOn && matchWaiter(rejectOn, value)) {
                unwatch(hs, hv, watcherId);
                reject(value);
            }
        });
    });
}
