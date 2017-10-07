import {HyperValue, record, Watcher} from '../core';
import {includes} from '../utils';

export function $hv<T>(value?: T): HyperValue<T> {
    return new HyperValue(value);
}

export function bind<T>(hv: HyperValue<T>, deps: HyperValue<any>[], fn: (params: HyperValue<any>[]) => T) {
    for (let dep of deps) {
        dep.watch(() => {
            hv.s(fn(deps));
        });
    }
}

export function $hc<T>(deps: HyperValue<any>[], fn: (params: HyperValue<any>[]) => T): HyperValue<T> {
    const hv = $hv<T>();

    bind(hv, deps, fn);

    hv.s(fn(deps));

    return hv;
}

export function $autoHv<T>(fn: () => T): HyperValue<T> {
    const [value, deps] = record(fn);
    const hv = $hv(value);

    const watcher = () => {
        const [value, newDeps] = record(fn);
        const newDepsClean = newDeps.filter(newDep => {
            return !includes(deps, newDep);
        });
        for (let dep of newDeps) {
            dep.watch(watcher);
        }
        hv.s(value);
    };

    for (let dep of deps) {
        dep.watch(watcher);
    }

    return hv;
}

export function wrapHv<I, O>(hv: HyperValue<I>, fn: (value: I) => O): HyperValue<O> {
    return $hc([hv], ([hv]) => fn(hv.g()));
}
