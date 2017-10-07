import {HyperValue, record, Watcher} from '../core';
import {includes} from '../utils';

export function hvMake<T>(value: T): HyperValue<T> {
    return new HyperValue(value);
}

export function hvBind<T>(hv: HyperValue<T>, deps: HyperValue<any>[], fn: (params: HyperValue<any>[]) => T) {
    for (let dep of deps) {
        dep.watch(() => {
            hv.s(fn(deps));
        });
    }
}

export function hvEval<T>(deps: HyperValue<any>[], fn: (params: HyperValue<any>[]) => T): HyperValue<T> {
    const hv = hvMake<any>(null) as HyperValue<T>;

    hvBind(hv, deps, fn);

    hv.s(fn(deps));

    return hv;
}

export function hvAuto<T>(fn: () => T): HyperValue<T> {
    const [value, deps] = record(fn);
    const hv = hvMake(value);

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
    return hvEval([hv], ([hv]) => fn(hv.g()));
}
