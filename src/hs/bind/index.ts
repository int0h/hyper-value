import {HyperValue, record} from '../../core';
import {HyperScope} from '../../scopes';
import {watch} from '../watch';
import {unwatch} from '../unwatch';

interface Dep {
    watcherId: number;
    hvId: number;
}

/**
 * Works almost the same as `auto` but instead of creating a new hyper-value
 * it updates existing one.
 * It gets `fn` result value and keeps track of changes of used hyper-values.
 * @param hs HyperScope instance
 * @param hv hyper-value to be updated
 * @param fn function that computes the value
 * @param init if set to false it will not set the initial value straight after calling `bind`
 */
export function bind<T>(hs: HyperScope, hv: HyperValue<T>, fn: () => T, init = true) {
    let depList = [] as Dep[];

    const watchDeps = (hvIdList: number[]) => {
        return hvIdList.map(hvId => {
            return {
                hvId,
                watcherId: watch(hs, hvId, watcher.bind(null, true))
            };
        });
    };

    const watcher = (needInit: boolean) => {
        // do we need it still?
        for (const dep of depList) {
            unwatch(hs, dep.hvId, dep.watcherId, true);
        }

        let value, deps;

        try {
            [value, deps] = record(fn);
        } catch (error) {
            hs.fail(hv, error, {
                oldValue: hv.$
            });
            depList = watchDeps(depList.map(dep => dep.hvId));
            return;
        }

        depList = watchDeps(deps.map(hv => hv.id));

        if (needInit) {
            hv.s(value);
        }
    };

    watcher(init);
}
