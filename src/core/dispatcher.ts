import {List, IdDict} from '../utils/list';

export interface WatcherFn<T> {
    (newValue: T, oldValue: T): void;
}

type WatcherList = List<WatcherFn<any>>;

export class HvDispatcher {
    private watcherSets: IdDict<WatcherList> = {};

    watch(hvId: number, fn: WatcherFn<any>): number {
        let currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            currentSet = new List();
            this.watcherSets[hvId] = currentSet;
        }
        return currentSet.add(fn);
    }

    unwatch(hvId: number, watcherId: number) {
        let currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            throw new Error('incorrect watcher ID');
        }
        currentSet.del(watcherId);
    }

    handle(hvId: number, oldValue: any, newValue: any) {
        let currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            return;
        }
        currentSet.entries().forEach(([, watcher]) => {
            watcher(oldValue, newValue);
        });
    }
}

export const globalDispatcher = new HvDispatcher();
