import {HyperValue} from '../core/core';
import {globalDispatcher, WatcherFn} from '../core/dispatcher';
import {IdDict} from '../utils/list';

export class BaseScope {
    watcherList: IdDict<IdDict<number>> = {};

    watch<T>(hv: HyperValue<T>, fn: WatcherFn<T>): number {
        const watcherId = globalDispatcher.watch(hv.id, fn);
        let watcherSet = this.watcherList[hv.id];
        if (!watcherSet) {
            watcherSet = {};
            this.watcherList[hv.id] = watcherSet;
        }
        watcherSet[watcherId] = watcherId;
        return watcherId;
    }

    unwatch(hv: HyperValue<any>, watcherId: number) {
        const watcherSet = this.watcherList[hv.id];
        if (!watcherSet) {
            throw new Error('incorrect hv ID');
        }
        delete watcherSet[watcherId];
        globalDispatcher.unwatch(hv.id, watcherId);
    }

    free() {
        for (const hvId in this.watcherList) {
            const watcherSet = this.watcherList[hvId];
            for (const watcherId in watcherSet) {
                globalDispatcher.unwatch(Number(hvId), Number(watcherId));
            }
        }
        this.watcherList = {};
    }
}
