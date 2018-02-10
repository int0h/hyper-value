import {HyperValue, record} from '../core';
import {BaseScope} from './base';

interface Dep {
    watcherId: number;
    hvId: number;
}

export class AutoScope extends BaseScope {
    bind<T>(hv: HyperValue<T>, fn: () => T, init = true) {
        let depList = [] as Dep[];

        const watchDeps = (hvIdList: number[]) => {
            return hvIdList.map(hvId => {
                return {
                    hvId,
                    watcherId: this.watch(hvId, watcher.bind(null, true))
                };
            });
        };

        const watcher = (needInit: boolean) => {
            // do we need it still?
            for (const dep of depList) {
                this.unwatch(dep.hvId, dep.watcherId, true);
            }

            let value, deps;

            try {
                [value, deps] = record(fn);
            } catch (error) {
                this.fail(hv, error, {
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


    auto<T>(fn: () => T): HyperValue<T> {
        const hv = new HyperValue(null as any as T);
        this.bind(hv, fn, true);
        return hv;
    }
}
