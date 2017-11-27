import {Watcher, WatcherId, WatcherFn, addToRecords} from './watchers';

export class HyperValue<T> {
    private watchers: Watcher<T>[] = [];
    private watchersToDelete = new Set<WatcherId>();
    private value: T;
    private newValue: T;
    private updating = false;
    private currentWatcherId = 0;
    debug: any;

    constructor(initialValue: T) {
        this.value = initialValue;
        this.debug = new Error('');
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

        this.cleanWatchers();
        const runList = this.getHandlers();

        if (runList.length % 10 === 0 && runList.length > 10) {
            console.log('runners', runList.length);
        }

        for (let fn of runList) {
            fn(newValue, this.value);
        }

        this.value = newValue;

        this.updating = false;
    }

    private getHandlers(): WatcherFn<T>[] {
        let toRun: WatcherFn<T>[] = [];

        for (let watcher of this.watchers) {
            if (watcher.once) {
                this.unwatch(watcher.id);
            }
            toRun.push(watcher.fn);
        }

        return toRun;
    }

    watch(fn: WatcherFn<T>, once: boolean = false): WatcherId {
        const id = this.currentWatcherId;
        this.currentWatcherId++;
        const watcher = {fn, id, once};
        this.watchers.push(watcher);
        if (this.watchers.length % 10 === 0) {
            console.log('watchers', this.watchers.length);
        }
        return id;
    }

    unwatch(id: WatcherId) {
        this.watchersToDelete.add(id);

        onNextTick(this.cleanWatchers);
    }

    cleanWatchers = () => {
        if (this.watchersToDelete.size < 1) {
            return;
        }

        let deletedCount = 0;
        let newWatchers: Watcher<T>[] = [];

        for (let watcher of this.watchers) {
            if (this.watchersToDelete.has(watcher.id)) {
                deletedCount++;
                continue;
            }
            newWatchers.push(watcher);
        }

        if (this.watchersToDelete.size !== deletedCount) {
            throw new Error('Bad watcher ID');
        }

        this.watchersToDelete = new Set<WatcherId>();
        this.watchers = newWatchers;
    }
}


let nextTickTaskList: Function[] = [];

function onNextTick(task: () => void) {
    if (nextTickTaskList.length === 0) {
        setTimeout(() => {
            for (let task of nextTickTaskList) {
                task();
            }
            nextTickTaskList = [];
        }, 0);
    }

    nextTickTaskList.push(task);
}
