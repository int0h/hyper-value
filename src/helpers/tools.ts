import {HyperValue, record, WatcherFn, WatcherId} from '../core';

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

        hvOnceOf(deps, watcher);
    };

    watcher();

    return hv;
}

export function hvWrap<I, O>(hv: HyperValue<I>, fn: (value: I) => O): HyperValue<O> {
    return hvAuto(() => fn(hv.g()));
}

export function hvCast<T>(rawValue: T | HyperValue<T>): HyperValue<T> {
    if (rawValue instanceof HyperValue) {
        return rawValue;
    }

    return hvMake(rawValue);
}

export function hvOnceOf(hvs: HyperValue<any>[], watcher: WatcherFn<any>) {
    const commonWatcher = (newValue: any, oldValue: any) => {
        for (let [hv, id] of subscribers) {
            hv.unwatch(id);
        }
        watcher(newValue, oldValue);
    };

    let subscribers: [HyperValue<any>, WatcherId][] = [];

    for (let hv of hvs) {
        const id = hv.watch(commonWatcher);
        subscribers.push([hv, id]);
    }
}

export function linkWatcher(hv: HyperValue<any>, deps: HyperValue<any>[], watcher: WatcherFn<any>): number[] {
    return deps.map(dep => {
        return hv.link(dep, watcher);
    });
}

export function unlinkWatcher(hv: HyperValue<any>, depIds: number[]): void {
    for (const depId of depIds) {
        hv.unlink(depId);
    }
}
