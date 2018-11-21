import {HyperValue} from '../../core/core';
import {HyperScope} from '../../scopes';

import {watch} from '../watch';
import {unwatch} from '../unwatch';

/**
 * Matcher is either the primitive value (e.g. `123` / `'abc'`)
 * or a function that returns `true` when provided with an appropriate argument.
 * @typeparam T type of hyper-value
 * @typeparam V narrowed type of hyper-value; e.g. `wait(hs, hv, 123 as 123)` will be resolved with `HyperValue<123>` but not with `HyperValue<number>`
 */
export type Matcher<T, V extends T> = V | ((value: T) => boolean | void);

function matchWaiter<T, V extends T>(matcher: Matcher<T, V>, value: T): boolean {
    if (typeof matcher === 'function') {
        if ((matcher as any)(value)) {
            return true;
        }
        return false;
    }
    return matcher === value;
}

function notUndefined(value: any) {
    return value !== undefined;
}

/**
 * `watch` takes a hyper-value and wait until it matches to a matcher. When it match it resolves returned promise.
 * If there are only 2 arguments provided it waits until hyper-value is not `undefined`
 * @param hs HyperScope instance
 * @param hv hyper-value to be observed
 * @typeparam V type of hyper-value
 * @returns a promise to be resolved when `matcher` matches
 */
export function wait<V>(hs: HyperScope, hv: HyperValue<V | undefined>): Promise<HyperValue<V>>;

/**
 * `watch` takes a hyper-value and wait until it matches to a matcher. When it match it resolves returned promise.
 * If there are only 2 arguments provided it waits until hyper-value is not `undefined`
 * @param hs HyperScope instance
 * @param hv hyper-value to be observed
 * @param resolveOn matcher that triggers `resolve` of the Promise
 * @param rejectOn matcher that triggers `reject` of the Promise
 * @typeparam T type of hyper-value
 * @typeparam V narrowed type of hyper-value; e.g. `wait(hs, hv, 123 as 123)` will be resolved with `HyperValue<123>` but not with `HyperValue<number>`
 * @returns a promise to be resolved when `matcher` matches
 */
export function wait<V extends T, T = V | undefined>(hs: HyperScope, hv: HyperValue<T>, resolveOn: Matcher<T, V>, rejectOn?: Matcher<T, V>): Promise<HyperValue<V>>;

export function wait<V extends T, T = V | undefined>(hs: HyperScope, hv: HyperValue<T>, resolveOn: Matcher<T, V> = notUndefined, rejectOn?: Matcher<T, V>): Promise<HyperValue<V>> {
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
