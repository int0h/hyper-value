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
    private hs: BaseScope;
    private currentPromise: Promise<HvAsync<T, T>>;

    constructor(hs: BaseScope, initial: I, fn: AsyncFn<T>) {
        super(initial);
        this.hs = hs;
        this.getter = fn;
        this.wait();
    }

    private fetch(fn: () => Promise<T>) {
        this.currentPromise = new Promise<HvAsync<T, T>>(resolve => {
            fn().then(value => new HvAsync(this.hs, value, this.getter));
        });

        this.wait().then(newHv => {
            this.$ = newHv.$;
            this.state
        })


        //     const onResolve = (value: T) => {
        //         if (promsise !== this.currentPromise) {
        //             this.currentPromise.then(newHv => onResolve(newHv.$));
        //         }

        //         this.state.$ = 'resolved';
        //         this.$ = value;
        //         resolve(new HvAsync(this.hs, value, this.getter));
        //     };

        //     fn().then(value => {
        //         onResolve
        //     });
        // });
        // this.state.$ = 'pending';
    }

    private init() {
        let depList = [] as Dep[];

        const watcher = () => {
            for (const dep of depList) {
                this.hs.unwatch(dep.hvId, dep.watcherId);
            }

            recordAsync(this.fetch(this.getter)).then(([value, deps]) => {
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
    }

    wait(): Promise<HvAsync<T, T>> {
        return new Promise(resolve => {
            const promise = this.currentPromise;
            promise.then(value => {
                if (this.currentPromise !== promise) {
                    this.wait().then(resolve);
                    return;
                }

                resolve(value);
            });
        });
    }

    // wait(): Promise<HvAsync<T, T>> {
    //     if (this.currentPromise) {
    //         return this.currentPromise;
    //     }


    //     this.currentPromise = new Promise(resolve => {
    //         const watcher = () => {
    //             for (const dep of depList) {
    //                 this.hs.unwatch(dep.hvId, dep.watcherId);
    //             }

    //             recordAsync(this.getter).then(([value, deps]) => {
    //                 this.currentPromise = null;

    //                 depList = deps.map(hv => {
    //                     return {
    //                         hvId: hv.id,
    //                         watcherId: this.hs.watch(hv, watcher)
    //                     };
    //                 });

    //                 this.s(value);

    //                 resolve(this as HvAsync<T, T>);
    //             });
    //         };

    //         watcher();
    //     });

    //     return this.currentPromise;
    // }
}

export interface AsyncSetter<T> {
    (value: T): Promise<T>;
}

export class AsyncScope extends BaseScope {
    async<T, I>(inited: I, getter: AsyncFn<T>/*, setter?: AsyncSetter<T>*/): HvAsync<T, I> {
        return new HvAsync(this, inited, getter);
    }
}
