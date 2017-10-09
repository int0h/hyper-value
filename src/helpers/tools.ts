import {HyperValue, record} from '../core';

export function hvMake<T>(value?: T): HyperValue<T> {
    return new HyperValue(value as T);
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
    const hv = hvMake<T>();

    const watcher = () => {
        const [value, deps] = record(fn);

        hv.s(value);

        for (let dep of deps) {
            dep.watch(watcher, true);
        }
    };

    watcher();

    return hv;
}

export function hvWrap<I, O>(hv: HyperValue<I>, fn: (value: I) => O): HyperValue<O> {
    return hvEval([hv], ([hv]) => fn(hv.g()));
}

