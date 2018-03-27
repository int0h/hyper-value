import {HyperValue} from '../core/core';
import {AutoScope} from './auto';
import {CastScope} from './cast';
import {mixSome, Mixin} from '../utils/mixin';

export interface IteratorFn<T, R> {
    (value: T, index: number, array: T[]): R;
}

export interface Reducer<T, R> {
    (acc: R, value: T, index: number, array: T[]): R;
}

export const Base = mixSome(AutoScope, CastScope) as Mixin<AutoScope, CastScope>;

export class ArrayScope extends Base {
    length(hv: HyperValue<any[]>): HyperValue<number> {
        return this.auto(() => {
            return hv.$.length;
        });
    }

    map<T, R>(hv: HyperValue<T[]>, mapFn: IteratorFn<T, R>): HyperValue<R[]> {
        return this.auto(() => {
            return hv.$.map(mapFn);
        });
    }

    every<T>(hv: HyperValue<T[]>, mapFn: IteratorFn<T, boolean>): HyperValue<boolean> {
        return this.auto(() => {
            return hv.$.every(mapFn);
        });
    }

    some<T>(hv: HyperValue<T[]>, mapFn: IteratorFn<T, boolean>): HyperValue<boolean> {
        return this.auto(() => {
            return hv.$.some(mapFn);
        });
    }

    filter<T>(hv: HyperValue<T[]>, mapFn: IteratorFn<T, boolean>): HyperValue<T[]> {
        return this.auto(() => {
            return hv.$.filter(mapFn);
        });
    }

    reduce<T>(hv: HyperValue<T[]>, reducer: Reducer<T, T>): HyperValue<T>;

    reduce<T, R>(hv: HyperValue<T[]>, reducer: Reducer<T, R>, initial: R): HyperValue<R>;

    reduce<T, R>(hv: HyperValue<T[]>, reducer: Reducer<T, R>, initial?: R): HyperValue<R> {
        return this.auto(() => {
            return initial !== undefined
                ? hv.$.reduce(reducer, initial)
                : hv.$.reduce(reducer as any as Reducer<T, T>) as any as R;
        });
    }

    find<T>(hv: HyperValue<T[]>, fn: IteratorFn<T, boolean>): HyperValue<T | null> {
        return this.auto(() => {
            const array = hv.$;
            for (let i = 0; i < array.length; i++) {
                if (fn(array[i], i, array)) {
                    return array[i];
                }
            }
            return null;
        });
    }

    findIndex<T>(hv: HyperValue<T[]>, fn: IteratorFn<T, boolean>): HyperValue<number | null> {
        return this.auto(() => {
            const array = hv.$;
            for (let i = 0; i < array.length; i++) {
                if (fn(array[i], i, array)) {
                    return i;
                }
            }
            return -1;
        });
    }

    concat<T1>(hv1: HyperValue<T1[]>): HyperValue<T1[]>;
    concat<T1, T2>(hv1: HyperValue<T1[]>, hv2: HyperValue<T2[]>): HyperValue<(T1 | T2)[]>;
    concat<T1, T2, T3>(hv1: HyperValue<T1[]>, hv2: HyperValue<T2[]>, hv3: HyperValue<T2[]>): HyperValue<(T1 | T2 | T3)[]>;

    concat(...hvs: HyperValue<any[]>[]): HyperValue<any[]> {
        return this.auto(() => {
            const arrays = hvs.map(hv => hv.$);
            return Array.prototype.concat.apply([], [...arrays]);
        });
    }

    slice<T>(hv: HyperValue<T[]>, start?: number | HyperValue<number>, end?: number | HyperValue<number>): HyperValue<T[]> {
        return this.auto(() => {
            const array = hv.$;
            const s = start === undefined ? 0 : this.read(start);
            const e = end === undefined ? array.length : this.read(end);
            return array.slice(s, e);
        });
    }

    insert<T>(hv: HyperValue<T[]>, index: number, elems: T | T[]) {
        const array = hv.$;
        if (index < 0) {
            index = array.length + index;
        }
        const newArray = ([] as T[]).concat(
            array.slice(0, index),
            elems,
            array.slice(index)
        );
        hv.$ = newArray;
    }

    remove(hv: HyperValue<any[]>, index: number, length: number) {
        const array = hv.$;
        if (index < 0) {
            index = array.length + index;
        }
        const newArray = ([] as any[]).concat(array.slice(0, index), array.slice(index + length));
        hv.$ = newArray;
    }

    sort<T>(hv: HyperValue<T[]>, sortFn?: (a: T, b: T) => number): HyperValue<T[]> {
        return this.auto(() => {
            const array = hv.$.slice();
            array.sort(sortFn);
            return array;
        });
    }

}
