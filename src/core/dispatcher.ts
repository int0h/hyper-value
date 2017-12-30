import {List, IdDict} from '../utils/list';

export interface WatcherFn<T> {
    (newValue: T, oldValue: T): void;
}

export interface Catcher {
    (error: Error, details: ErrorDetails): void;
}

interface HvData {
    watchers: List<WatcherFn<any>>;
    catcher: Catcher | null;
}

export interface ErrorDetails {
    oldValue?: any;
    newValue?: any;
}

export class HvDispatcher {
    private watcherSets: IdDict<HvData> = {};
    private lastErrorDetails: ErrorDetails | null = null;

    watch(hvId: number, fn: WatcherFn<any>): number {
        let currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            currentSet = {
                watchers: new List(),
                catcher: null
            };
            this.watcherSets[hvId] = currentSet;
        }
        return currentSet.watchers.add(fn);
    }

    unwatch(hvId: number, watcherId: number) {
        let currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            throw new Error('incorrect hv ID');
        }
        currentSet.watchers.del(watcherId);
    }

    catch(hvId: number, catcher: Catcher) {
        let currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            currentSet = {
                watchers: new List(),
                catcher: null
            };
            this.watcherSets[hvId] = currentSet;
        }
        currentSet.catcher = catcher;
    }

    handle(hvId: number, newValue: any, oldValue: any) {
        let currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            return;
        }
        currentSet.watchers.entries().forEach(([, watcher]) => {
            try {
                watcher(newValue, oldValue);
            } catch (error) {
                this.lastErrorDetails = {newValue, oldValue};
                this.fail(hvId, error);
            }
        });
    }

    fail(hvId: number, error: Error, details?: ErrorDetails) {
        let currentSet = this.watcherSets[hvId];
        if (!currentSet) {
            throw error;
        }

        if (currentSet.catcher) {
            details = details || this.lastErrorDetails as ErrorDetails;
            currentSet.catcher(error, details);
            this.lastErrorDetails = null;
            return;
        }

        throw error;
    }
}

export const globalDispatcher = new HvDispatcher();
