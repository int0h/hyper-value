import {HyperValue} from '../core';
import {hvMake, hvAuto, hvCalc, hvBind} from './tools';

export type IterationFunc<T, R> = (value: T, index: number) => R | HyperValue<R>;
type IterationFuncStrict<T, R> = (value: HyperValue<T>, index: number) => R;
export type ReduceFunc<T> = (acc: any, value: T, index: number) => any;

function injectGet<T, R>(fn: IterationFunc<T, R>): IterationFuncStrict<T, R> {
    return function(hv: HyperValue<T>, index) {
        let result = fn(hv.g(), index);
        if (result instanceof HyperValue) {
            result = result.g();
        }
        return result;
    };
}

export class HvArray<T> extends HyperValue<HyperValue<T>[]> {

    constructor (sourceArray: HyperValue<T>[]) {
        super(sourceArray);
    }

    static fromHv<T>(hv: HyperValue<HyperValue<T>[]>): HvArray<T> {
        let hvArray = new HvArray<T>([]);
        hvBind(hvArray, [hv], () => hv.g());
        return hvArray;
    }

    private getItems(): T[] {
        return this.g().map(item => item.g());
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

    pop(): HyperValue<T> {
        return this.applyMutatorMethod('pop', []);
    }

    push(...items: HyperValue<T>[]): number {
        return this.applyMutatorMethod('push', items);
    }

    reverse(): HyperValue<T>[] {
        return this.applyMutatorMethod('reverse', []);
    }

    shift(): HyperValue<T> {
        return this.applyMutatorMethod('shift', []);
    }

    unshift(...items: HyperValue<T>[]): number {
        return this.applyMutatorMethod('unshift', items);
    }

    splice(start: number, deleteCount?: number, ...items: HyperValue<T>[]): HvArray<T> {
        return this.applyMutatorMethod('unshift', [start, deleteCount, ...items]);
    }

    // accessors:

    concat(hvArray: HvArray<T> | HyperValue<T>[]): HvArray<T> {
        if (!(hvArray instanceof HvArray)) {
            hvArray = new HvArray(hvArray);
        }
        const hv = hvCalc([hvArray], ([hvArray]) => {
            return this.g().concat(hvArray.g());
        });
        return HvArray.fromHv(hv);
    }

    slice(start?: number | HyperValue<number | undefined>, end?: number | HyperValue<number | undefined>): HvArray<T> {
        if (!(start instanceof HyperValue)) {
            start = hvMake(start);
        }
        if (!(end instanceof HyperValue)) {
            end = hvMake(end);
        }
        const hv = hvCalc([this, start, end], ([self, start, end]) => {
            return self.g().slice(start.g(), end.g());
        });
        return HvArray.fromHv(hv);
    }

    // iterators:

    private applyIteratorMethod<R>(name: string, fn: IterationFunc<T, R>, thisArg?: any): any {
        let listCopy = this.g();
        const result = (listCopy as any)[name].call(listCopy, fn, thisArg);
        return result;
    }

    every(fn: IterationFunc<T, boolean>, thisArg?: any): HyperValue<boolean> {
        return hvAuto(() => this.g().every(injectGet(fn), thisArg));
    }

    some(fn: IterationFunc<T, boolean>, thisArg?: any): HyperValue<boolean> {
        return hvAuto(() => this.g().some(injectGet(fn), thisArg));
    }

    filter(fn: IterationFunc<T, boolean>, thisArg?: any): HvArray<T> {
        const hv = hvAuto(() => this.g().filter(injectGet(fn), thisArg));
        return HvArray.fromHv(hv);
    }

    map<R>(fn: IterationFunc<T, R>, thisArg?: any): HyperValue<R[]> {
        return hvAuto(() => this.g().map(injectGet(fn), thisArg));
    }

    reduce(fn: ReduceFunc<T>, initialValue?: any): HyperValue<any> {
        return hvAuto(() => {
            return this.g().reduce((acc, curHv, index) => {
                const val = curHv.g();
                return fn(acc, val, index);
            }, initialValue);
        });
    }

    find(fn: IterationFunc<T, boolean>, thisArg?: any): HyperValue<T> {
        return hvAuto(() => this.g().find(injectGet(fn), thisArg).g());
    }

    findIndex(fn: IterationFunc<T, boolean>, thisArg?: any): HyperValue<number> {
        return hvAuto(() => this.g().findIndex(injectGet(fn), thisArg));
    }

}
