import {HyperValue} from '../core';
import {hvAuto, hvBind, hvCast} from './tools';

export type IterationFunc<T, R> = (value: T, index: number) => R;
export type ReduceFunc<T> = (acc: any, value: T, index: number) => any;

export class HvArray<T> extends HyperValue<T[]> {

    constructor (sourceArray: T[]) {
        super(sourceArray);
    }

    static fromHv<T>(hv: HyperValue<T[]>): HvArray<T> {
        let hvArray = new HvArray<T>([]);
        hvBind(hvArray, [hv], () => hv.g());
        return hvArray;
    }

    getLength (): HyperValue<number> {
        return hvAuto(() => {
            return this.g().length;
        });
    }

    // mutators:

    private applyMutatorMethod(name: string, args: any[]): any {
        let listCopy = this.g();
        const result = (listCopy as any)[name].apply(listCopy, args);
        this.s(listCopy);
        return result;
    }

    pop(): T {
        return this.applyMutatorMethod('pop', []);
    }

    push(...items: T[]): number {
        return this.applyMutatorMethod('push', items);
    }

    // reverse(): HyperValue<T>[] {
    //     return this.applyMutatorMethod('reverse', []);
    // }

    // shift(): HyperValue<T> {
    //     return this.applyMutatorMethod('shift', []);
    // }

    // unshift(...items: HyperValue<T>[]): number {
    //     return this.applyMutatorMethod('unshift', items);
    // }

    // splice(start: number, deleteCount?: number, ...items: HyperValue<T>[]): HvArray<T> {
    //     return this.applyMutatorMethod('unshift', [start, deleteCount, ...items]);
    // }

    // accessors:

    concat(array: HvArray<T> | T[]): HvArray<T> {
        const hvArray = hvCast(array);
        const hv = hvEval([hvArray], ([hvArray]) => {
            return this.g().concat(hvArray.g());
        });
        return HvArray.fromHv(hv);
    }

    slice(start?: number | HyperValue<number | undefined>, end?: number | HyperValue<number | undefined>): HvArray<T> {
        const hvStart = hvCast(start);
        const hvEnd = hvCast(end);
        const hv = hvEval([this, hvStart, hvEnd], ([self, hvStart, hvEnd]) => {
            return self.g().slice(hvStart.g(), hvEnd.g());
        });
        return HvArray.fromHv(hv);
    }

    // iterators:

    every(fn: IterationFunc<T, boolean>, thisArg?: any): HyperValue<boolean> {
        return hvAuto(() => this.g().every(fn, thisArg));
    }

    some(fn: IterationFunc<T, boolean>, thisArg?: any): HyperValue<boolean> {
        return hvAuto(() => this.g().some(fn, thisArg));
    }

    filter(fn: IterationFunc<T, boolean>, thisArg?: any): HvArray<T> {
        const hv = hvAuto(() => this.g().filter(fn, thisArg));
        return HvArray.fromHv(hv);
    }

    map<R>(fn: IterationFunc<T, R>, thisArg?: any): HyperValue<R[]> {
        return hvAuto(() => this.g().map(fn, thisArg));
    }

    // reduce(fn: ReduceFunc<T>, initialValue?: any): HyperValue<any> {
    //     return hvAuto(() => {
    //         return this.g().reduce((acc, curHv, index) => {
    //             const val = curHv.g();
    //             return fn(acc, val, index);
    //         }, initialValue);
    //     });
    // }

    // find(fn: IterationFunc<T, boolean>, thisArg?: any): HyperValue<T> {
    //     return hvAuto(() => this.g().find(injectGet(fn), thisArg).g());
    // }

    // findIndex(fn: IterationFunc<T, boolean>, thisArg?: any): HyperValue<number> {
    //     return hvAuto(() => this.g().findIndex(injectGet(fn), thisArg));
    // }

}
