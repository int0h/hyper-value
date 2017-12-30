import {HyperValue, record} from '../core';
import {globalDispatcher} from '../core/dispatcher';
import {BaseScope} from './base';

interface Dep {
    watcherId: number;
    hvId: number;
}

export class AutoScope extends BaseScope {
    bind<T>(hv: HyperValue<T>, fn: () => T) {
        let depList = [] as Dep[];

        const watchDeps = (hvIdList: number[]) => {
            return hvIdList.map(hvId => {
                return {
                    hvId,
                    watcherId: this.watch(hvId, watcher)
                };
            });
        };

        const watcher = () => {
            // do we need it still?
            for (const dep of depList) {
                this.unwatch(dep.hvId, dep.watcherId, true);
            }

            let value, deps;

            try {
                [value, deps] = record(fn);
            } catch (error) {
                globalDispatcher.fail(hv.id, error, {
                    oldValue: hv.$
                });
                depList = watchDeps(depList.map(dep => dep.hvId));
                return;
            }

            depList = watchDeps(deps.map(hv => hv.id));

            hv.s(value);
        };

        watcher();
    }


    auto<T>(fn: () => T): HyperValue<T> {
        const hv = new HyperValue(null as any as T);
        this.bind(hv, fn);
        return hv;
    }
}
