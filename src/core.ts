let recordedHvStack: HyperValue<any>[][] = [];

export interface WatcherFn<T> {
    (newValue: T, oldValue: T): void;
}
type Watcher<T> = {
    fn: (newValue: T, oldValue: T) => void;
    id: WatcherId;
    once: boolean;
};

export type WatcherId = number;

export class HyperValue<T> {
    private watchers: Watcher<T>[] = [];
    private watchersToDelete: WatcherId[] = [];
    private value: T;
    private newValue: T;
    private updating = false;
    private currentWatcherId = 0;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    g(silent?: boolean): T {
        if (!silent) {
            addToRecords(this);
        }
        if (this.updating) {
            return this.newValue;
        }
        return this.value;
    }

    s(newValue: T) {
        if (this.updating) {
            return;
        }

        this.updating = true;

        this.newValue = newValue;

        const runList = this.prepareWatchers();

        for (let fn of runList) {
            fn(newValue, this.value);
        }

        this.value = newValue;

        this.updating = false;
    }

    private prepareWatchers(): WatcherFn<T>[] {
        let toRun: WatcherFn<T>[] = [];
        let newWatchers: Watcher<T>[] = [];

        for (let watcher of this.watchers) {
            if (this.watchersToDelete.indexOf(watcher.id) !== -1) {
                continue;
            }
            if (!watcher.once) {
                newWatchers.push(watcher);
            }
            toRun.push(watcher.fn);
        }

        this.watchers = newWatchers;
        this.watchersToDelete = [];

        return toRun;
    }

    watch(fn: WatcherFn<T>, once: boolean = false): WatcherId {
        const id = this.currentWatcherId;
        this.currentWatcherId++;
        const watcher = {fn, id, once};
        this.watchers.push(watcher);
        return id;
    }

    unwatch(id: WatcherId) {
        this.watchersToDelete.push(id);
    }
}

function hvRecordStart() {
    recordedHvStack.push([]);
}

function hvRecordStop() {
    const newList = recordedHvStack.pop();
    return newList;
}

function addToRecords(hv: HyperValue<any>) {
    if (recordedHvStack.length <= 0) {
        return;
    }
    const currentList = recordedHvStack[recordedHvStack.length - 1];
    if (currentList.indexOf(hv) === -1) {
        currentList.push(hv);
    }
}

export function record<T>(fn: () => T): [T, HyperValue<any>[]] {
    hvRecordStart();
    const result = fn();
    return [result, hvRecordStop() as HyperValue<any>[]];
}
