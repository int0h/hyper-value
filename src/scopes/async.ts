import {HyperValue, recordAsync, PromiseWrapper} from '../core';
import {BaseScope} from './base';

export interface AsyncFn<T> {
    (w: PromiseWrapper): Promise<T>;
}

interface Dep {
    watcherId: number;
    hvId: number;
}

export class HvAsync<T, I> extends HyperValue<T | I> {
    state = new HyperValue('pending') as HyperValue<'pending' | 'resolved' | 'rejected'>;
    private getter: AsyncFn<T>;
    private setter: AsyncSetter<T> | undefined;
    private hs: BaseScope;
    private callId = 0;
    private currentPromise: Promise<T>;
    private resolver: () => void;
    private rejecter: (error: Error) => void;

    constructor(hs: BaseScope, initial: I, getter: AsyncFn<T>, setter?: AsyncSetter<T>) {
        super(initial);
        this.hs = hs;
        this.getter = getter;
        this.setter = setter;
        this.initPromise();
        this.init();
    }

    private initPromise() {
        this.currentPromise = new Promise((resolve, reject) => {
            this.resolver = resolve;
            this.rejecter = reject;
        });
    }

    private fetch(fn: () => Promise<T>): Promise<T> {
        return new Promise((resolve, reject) => {
            this.callId++;
            const id = this.callId;

            this.state.$ = 'pending';

            fn().then(
                value => {
                    if (this.callId === id) {
                        this.$ = value;
                        this.state.$ = 'resolved';
                        this.resolver();
                        this.initPromise();
                    }

                    resolve(value);
                },
                error => {
                    if (this.callId === id) {
                        this.state.$ = 'rejected';
                        this.rejecter(error);
                        this.initPromise();
                    }

                    reject(error);
                }
            );
        });
    }

    wait(): Promise<HvAsync<T, T>> {
        return this.currentPromise.then(() => this as any as HvAsync<T, T>);
    }

    private init() {
        let depList = [] as Dep[];

        const watchDeps = (hvIdList: number[]) => {
            return hvIdList.map(hvId => {
                return {
                    hvId,
                    watcherId: this.hs.watch(hvId, watcher)
                };
            });
        };

        const watcher = () => {
            for (const dep of depList) {
                this.hs.unwatch(dep.hvId, dep.watcherId);
            }

            recordAsync(w => {
                return this.fetch(() => this.getter(w));
            }, deps => {
                depList = depList.concat(watchDeps(deps.map(hv => hv.id)));
            })
            .catch(() => {
                depList = watchDeps(depList.map(dep => dep.hvId));
            });
        };

        watcher();
    }

    s(newValue: T) {
        if (!this.setter) {
            super.s(newValue);
            return;
        }

        this.state.$ = 'pending';
        this.setter(newValue).then(value => {
            this.state.$ = 'resolved';
            super.s(value);
        });
    }
}

export interface AsyncSetter<T> {
    (value: T): Promise<T>;
}

export class AsyncScope extends BaseScope {
    async<T, I>(inited: I, getter: AsyncFn<T>, setter?: AsyncSetter<T>): HvAsync<T, I> {
        return new HvAsync(this, inited, getter, setter);
    }
}
