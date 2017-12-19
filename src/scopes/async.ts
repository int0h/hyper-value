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
    state: HyperValue<'pending' | 'resolved' | 'rejected'>;
    private getter: AsyncFn<T>;
    private hs: BaseScope;
    private currentPromise: null | Promise<HvAsync<T, T>> = null;

    constructor(hs: BaseScope, initial: I, fn: AsyncFn<T>) {
        super(initial);
        this.hs = hs;
        this.getter = fn;
        this.fetch();
    }

    fetch(): Promise<HvAsync<T, T>> {
        if (this.currentPromise) {
            return this.currentPromise;
        }

        let depList = [] as Dep[];

        this.currentPromise = new Promise(resolve => {
            const watcher = () => {
                for (const dep of depList) {
                    this.hs.unwatch(dep.hvId, dep.watcherId);
                }

                recordAsync(this.getter).then(([value, deps]) => {
                    this.currentPromise = null;

                    depList = deps.map(hv => {
                        return {
                            hvId: hv.id,
                            watcherId: this.hs.watch(hv, watcher)
                        };
                    });

                    this.s(value);

                    resolve(this as HvAsync<T, T>);
                });
            };

            watcher();
        });

        return this.currentPromise;
    }
}

export interface AsyncSetter<T> {
    (value: T): Promise<T>;
}

export class AsyncScope extends BaseScope {
    async<T, I>(inited: I, getter: AsyncFn<T>, setter?: AsyncSetter<T>): HvAsync<T, I> {
        return new HvAsync(this, inited, getter);
    }
}
