import {HyperValue, recordAsync, PromiseWrapper} from '../../core';
import {HyperScope} from '../../scopes';

interface Dep {
    watcherId: number;
    hvId: number;
}

export interface HvAsyncParams<T, I> {
    initial?: I;
    get?: AsyncGetter<T>;
    set?: AsyncSetterApprove<T>;
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

export type AsyncResult<T, I> = [HyperValue<T | I>, HyperValue<PromiseState>, HyperValue<any>];

export function async<T, I = undefined>(hs: HyperScope, params: HvAsyncParams<T, I>): AsyncResult<T, I> {
    const state = new HyperValue('pending') as HyperValue<'pending' | 'resolved' | 'rejected'>;
    const result = new HyperValue<T | I>(params.initial as I);
    const error = new HyperValue<any>(null);
    let getter: AsyncGetter<T> | undefined;
    let setter: AsyncSetter<T> | undefined;
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
        if (params.update) {
            setter = params.update;
        }
        if (params.set) {
            setter = value => {
                const setter = params.set as AsyncSetterApprove<T>;
                return setter(value).then(() => value);
            };
        }
        if (getter) {
            const definedGetter = getter;
            init((w) => fetch(() => definedGetter(w)));
        }
    }

    prepare();

    return [result, state, error];
}
