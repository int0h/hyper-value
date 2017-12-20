import {recordAsync, HyperValue, PromiseWrapper} from '../core';
import {hvOnceOf} from './tools';

export interface AsyncFn<T> {
    (w: PromiseWrapper): Promise<T>;
}

export function hvAsync<T>(fn: AsyncFn<T>): HvAsync<T, null>;
export function hvAsync<T, I>(inited: I, fn: AsyncFn<T>): HvAsync<T, I>;
export function hvAsync<T, I>(inited: I | AsyncFn<T>, fn?: AsyncFn<T>): HvAsync<T, I | null> {
    if (fn) {
        return new HvAsync(inited as I, fn);
    }
    return new HvAsync(null, inited as AsyncFn<T>);
}

export class HvAsync<T, I = null> extends HyperValue<T | I> {
    state: HyperValue<'pending' | 'resolved' | 'rejected'>;
    inited: Promise<HvAsync<T, T>>;

    constructor(initial: I, fn: AsyncFn<T>) {
        super(initial);

        this.inited = new Promise(resolve => {
            const watcher = () => {
                recordAsync(fn).then(([value, deps]) => {
                    this.s(value);
                    hvOnceOf(deps, watcher);
                    resolve(this as HvAsync<T, T>);
                });
            };

            watcher();
        });
    }
}
