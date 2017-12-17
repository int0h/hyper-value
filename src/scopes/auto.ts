import {HyperValue} from '../core/core';
import {record} from '../core';
import {BaseScope} from './base';

interface Dep {
    watcherId: number;
    hvId: number;
}

export class AutoScope extends BaseScope {
    bind<T>(hv: HyperValue<T>, fn: () => T) {
        let depList = [] as Dep[];

        const watcher = () => {
            // do we need it still?
            for (const dep of depList) {
                this.unwatch(dep.hvId, dep.watcherId);
            }

            const [value, deps] = record(fn);

            depList = deps.map(hv => {
                return {
                    hvId: hv.id,
                    watcherId: this.watch(hv, watcher)
                };
            });

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
