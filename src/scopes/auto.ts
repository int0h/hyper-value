import {HyperValue} from '../core/core';
import {record} from '../core/watchers';
import {globalDispatcher} from '../core/dispatcher';
import {List, IdDict} from '../utils/list';
import {BaseScope} from './base';

interface Dep {
    watcherId: number;
    hvId: number;
}

export class AutoScope extends BaseScope {
    bind<T>(hv: HyperValue<T>, fn: () => T) {
        let depList = [] as Dep[];
        let firstRun = true;

        const watcher = () => {
            // do we need it yet?
            for (const dep of depList) {
                this.unwatch(dep.hvId, dep.watcherId);
            }

            const [value, deps] = record(fn);

            depList = deps.map(hv => {
                return {
                    hvId: hv.id,
                    watcherId: this.watch(hv, watcher)
                }
            })

            depIdList = linkWatcher(hv, deps, watcher);

            hv.s(value);

            firstRun = false;
        };

        watcher();
    }


    auto() {

    }
}

