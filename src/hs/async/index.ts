import {HyperValue, recordAsync, PromiseWrapper} from '../../core';
import {HyperScope} from '../../scopes';

interface Dep {
    watcherId: number;
    hvId: number;
}

/**
 * Object containing configuration for `async` helper
*/
export interface HvAsyncParams<T, I> {
    /**
     * initial value of result hyper-value.
     * keep in mind that asynchronous function usually is not set when hyper-value is returned.
     * By default initial value will be `undefined`
     */
    initial?: I;

    /**
     * asynchronous function that will be called to calculate the value.
     * it also memorize used hyper-values and recalculate again if they change.
     */
    get?: AsyncGetter<T>;

    /**
     * asynchronous function to be called when a new value written into the hyper-value.
     * comparing to `update`: it takes a new value and called to only *approve* that new value.
     * there can be set either `set` or `update` not both of them.
     */
    set?: AsyncSetterApprove<T>;

    /**
     * asynchronous function to be called when a new value written into the hyper-value.
     * comparing to `set`: it takes a new value and set the hyper-value to resolved value.
     * there can be set either `set` or `update` not both of them.
     */
    update?: AsyncSetter<T>;
}

export interface AsyncGetter<T> {
    (w: PromiseWrapper): Promise<T>;
}

export interface AsyncSetter<T> {
    (value: T): Promise<T>;
}

export interface AsyncSetterApprove<T> {
    (value: T): Promise<void>;
}

export type PromiseState = 'pending' | 'resolved' | 'rejected';

/**
 * the result of `async` helper is an array contains of 3 elements:
 * 1. result hyper-value. it's set to a new value according to `get`, `set` and `update`;
 * 2. state hyper-value. it's set to the `Promise` state;
 * 3. error hyper-value; it's set to undefined when everything is fine, or to an error if it occurs;
 * it's recommended to use es6 array destructuring for usage.
 * e.g. `const [result, state] = async(...);`
 */
export type AsyncResult<T, I> = [HyperValue<T | I>, HyperValue<PromiseState>, HyperValue<any>];

/**
 * Works similarly to `auto` but takes asynchronous functions.
 * It takes a function, run it and returns a hyper-value that eventually will be equal
 * to resolved result of the function.
 *
 * @param hs HyperScope instance
 * @param params an object containing all possible params
 * @typeparam T represents the type of hyper-value after resolving
 * @typeparam I represents the initial type of hyper-value; if no initial value provided it's `undefined`
 */
export function async<T, I = undefined>(hs: HyperScope, params: HvAsyncParams<T, I>): AsyncResult<T, I> {
    const state = new HyperValue('pending') as HyperValue<PromiseState>;
    const result = new HyperValue<T | I>(params.initial as I);
    const error = new HyperValue<any>(null);
    let getter: AsyncGetter<T> | undefined;
    // let setter: AsyncSetter<T> | undefined;
    let callId = 0;

    function fetch(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            callId++;
            const id = callId;

            state.$ = 'pending';

            fn().then(
                value => {
                    if (callId === id) {
                        state.$ = 'resolved';
                        result.$ = value;
                    }

                    resolve(value);
                },
                err => {
                    if (callId === id) {
                        state.$ = 'rejected';
                    }

                    hs.fail(result, err);
                    error.$ = error;
                    reject(error);
                }
            );
        });
    }

    function init(fetcher: AsyncGetter<any>) {
        let depList = [] as Dep[];

        const watchDeps = (hvIdList: number[]) => {
            return hvIdList.map(hvId => {
                return {
                    hvId,
                    watcherId: hs.watch(hvId, watcher)
                };
            });
        };

        const watcher = () => {
            for (const dep of depList) {
                hs.unwatch(dep.hvId, dep.watcherId);
            }

            recordAsync(w => {
                return fetcher(w);
            }, deps => {
                depList = depList.concat(watchDeps(deps.map(hv => hv.id)));
            })
            .catch(() => {
                depList = watchDeps(depList.map(dep => dep.hvId));
            });
        };

        watcher();
    }

    function prepare() {
        getter = params.get;
        if (params.set && params.update) {
            throw new Error('both set and update cannot be defined');
        }
        // if (params.update) {
        //     setter = params.update;
        // }
        // if (params.set) {
        //     setter = value => {
        //         const setter = params.set as AsyncSetterApprove<T>;
        //         return setter(value).then(() => value);
        //     };
        // }
        if (getter) {
            const definedGetter = getter;
            init((w) => fetch(() => definedGetter(w)));
        }
    }

    prepare();

    return [result, state, error];
}
