import {HyperValue} from '../core/core';
import {globalDispatcher, WatcherFn} from '../core/dispatcher';
import {IdDict} from '../utils/list';
import {scopeDebug} from '../debug';

@scopeDebug
export class BaseScope {
    private watcherList: IdDict<IdDict<number>> = {};
    private children: BaseScope[] = [];

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

    unwatch(hv: HyperValue<any> | number, watcherId: number, tolerate?: boolean) {
        const hvId = typeof hv === 'number'
            ? hv
            : hv.id;
        const watcherSet = this.watcherList[hvId];
        if (!watcherSet) {
            if (tolerate) {
                return;
            }
            throw new Error('incorrect hv ID');
        }
        delete watcherSet[watcherId];
        globalDispatcher.unwatch(hvId, watcherId);
    }

    free() {
        for (const hvId in this.watcherList) {
            const watcherSet = this.watcherList[hvId];
            for (const watcherId in watcherSet) {
                this.unwatch(Number(hvId), Number(watcherId));
            }
        }
        this.watcherList = {};
        this.children.forEach(child => child.free());
    }

    regChild(child: BaseScope) {
        this.children.push(child);
    }
}
