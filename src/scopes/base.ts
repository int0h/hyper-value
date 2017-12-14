import {HyperValue} from '../core/core';
import {globalDispatcher, Watcher} from '../core/dispatcher';
import {List, IdDict} from '../utils/list';

export class BaseHvScope {
    private watcherList: List<List<number>> = new List();

    watch<T>(hv: HyperValue<T>, fn: Watcher<T>): number {
        const watcherId = globalDispatcher.watch(hv.id, fn);
        this.watcherList.get(hv.id).add(watcherId);
        return watcherId;
    }

    unwatch(hv: HyperValue<any>, watcherId: number) {
        globalDispatcher.unwatch(hv.id, watcherId);
        this.watcherList[hv.id].del(watcherId);
    }

    free() {

    }
}
