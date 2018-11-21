import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';
// import {proxy} from '../proxy';
import {array} from '../';
// import { IteratorFn } from '../array/common';
import { cast } from '../cast';
import { prop } from '../prop';
// import { proxy } from '../proxy';
import { auto } from '../auto';
import { bind } from '../bind';

type NewIteratorFn<I, R> = (item: HyperValue<I>, id: number) => R;

/* tslint:disable */
type ArrayHvProxy<I> = {
    map: <R>(mapFn: NewIteratorFn<I, R>) => HyperValue<R[]>;
    filter: (mapFn: NewIteratorFn<I, boolean>) => HyperValue<I[]>;
    insert: (index: number, elems: I | I[]) => void;
    push: (...elems: I[]) => void;
    elem: (id: number | HyperValue<number>) => HvProxy<I>
};

type HvProxy<T> =
    T extends Array<infer I> ?
        ArrayHvProxy<I> & {
            _: HyperValue<T>
        }
    :

    T extends object ? {
            [K in keyof T]: HvProxy<T[K]>
        } & {
            _: HyperValue<T>
    } :

    T extends (number | string | boolean) ?
        HyperValue<T>
    :

    never;
/* tslint:enable */

export function hv<T extends object>(hs: HyperScope, obj: T | HyperValue<T>, parentMeta?: {parent: HyperValue<any>, prop: string}): HvProxy<T> {
    const oh = cast(obj);

    if (Array.isArray(oh.$)) {
        const arrHv = (parentMeta
            ? prop(hs, parentMeta.parent, parentMeta.prop)
            : oh) as HyperValue<any[]>;

        return Object.assign(arrHv, {
            map: (fn) => {
                return auto(hs, () => {
                    return arrHv.$.map((item, id) => {
                        const itemHv = prop(hs, arrHv, id);
                        return fn(itemHv, id);
                    });
                });
                // array.map(hs, arrHv, fn)
            },
            filter: fn => array.filter(hs, arrHv, fn),
            insert: (index, elems) => array.insert(arrHv, index, elems),
            push: (...elems) => array.insert(arrHv, Infinity, elems),
            elem: (id) => {
                const idHv = cast(id);
                const res = auto(hs, () => arrHv.$[idHv.$]);

                bind(hs, arrHv, () => {
                    const arr = [...arrHv.$];
                    arr[idHv.$] = res.$;
                    return arr;
                }, false);

                return hv(hs, res);
            },
            _: arrHv
        } as ArrayHvProxy<any>) as any;
    }

    if (typeof oh.$ === 'object') {
        const res = {} as any;
        for (const key of Object.keys(oh.$)) {
            res[key] = hv(hs, (oh.$ as any)[key], {
                parent: oh,
                prop: key
            });
        }
        res._ = parentMeta
            ? prop(hs, parentMeta.parent, parentMeta.prop)
            : oh;
        return res;
    }

    if (['number', 'string', 'boolean'].indexOf(typeof oh.$) !== -1) {
        const _ = parentMeta
            ? prop(hs, parentMeta.parent, parentMeta.prop)
            : oh;
        return _ as any;
    }

    throw '';
}
