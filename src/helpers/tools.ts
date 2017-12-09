import {HyperValue, record, WatcherFn} from '../core';

export function hvMake<T>(value?: T): HyperValue<T> {
    return new HyperValue(value as T);
}

export function hvAuto<T>(fn: () => T): HyperValue<T> {
    const hv = new HyperValue(null as any as T);

    hvBind(hv, {init: true}, fn);

    return hv;
}

export interface HvBindParams {
    init?: boolean;
}

export function hvBind<T>(hv: HyperValue<T>, params: HvBindParams, fn: () => T) {
    let depIdList = [] as number[];
    let firstRun = true;

    function watcher() {
        unlinkWatcher(hv, depIdList);

        const [value, deps] = record(fn);

        depIdList = linkWatcher(hv, deps, watcher);

        if (!firstRun || params.init) {
            hv.s(value);
        }

        firstRun = false;
    }

    watcher();
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

    let subscribers: [HyperValue<any>, number][] = [];

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
