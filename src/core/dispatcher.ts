import {List, IdDict} from '../utils/list';

export type Watcher<T> = {
    fn: (newValue: T, oldValue: T) => void;
};

type WatcherList = List<Watcher<any>>;

export class HvDispatcher {
    private watcherSets: IdDict<WatcherList> = {};

    watch(hvId: number, fn: Watcher<any>): number {
        let currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            this.watcherSets[hvId] = new List();
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
            watcher.fn(oldValue, newValue);
        });
    }
}

export const globalDispatcher = new HvDispatcher();
