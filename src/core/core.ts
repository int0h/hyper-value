import {Watcher, WatcherId, WatcherFn, addToRecords} from './watchers';
import {List} from '../utils/list';

export interface Dep {
    hv: HyperValue<any>;
    watcherId: WatcherId;
}

export class HyperValue<T> {
    private watchers: List<Watcher<T>> = new List();
    private value: T;
    private newValue: T;
    private updating = false;
    private deps: List<Dep> = new List();
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

        const runList = this.getHandlers();

        for (let fn of runList) {
            fn(newValue, this.value);
        }

        this.value = newValue;

        this.updating = false;
    }

    private getHandlers(): WatcherFn<T>[] {
        let toRun: WatcherFn<T>[] = [];

        for (let [id, watcher] of this.watchers.entries()) {
            if (watcher.once) {
                this.unwatch(id);
            }
            toRun.push(watcher.fn);
        }

        return toRun;
    }

    watch(fn: WatcherFn<T>, once: boolean = false): WatcherId {
        return this.watchers.add({fn, once});
    }

    unwatch(id: WatcherId) {
        this.watchers.del(id);
    }

    link(hv: HyperValue<any>, fn: WatcherFn<T>): number {
        const watcherId = hv.watch(fn);
        return this.deps.add({hv, watcherId});
    }

    unlink(id: number) {
        const dep = this.deps.get(id);
        dep.hv.unwatch(dep.watcherId);
        this.deps.del(id);
    }

    free() {
        this.watchers = new List();
        for (let [id] of this.deps.entries()) {
            this.unlink(id);
        }
    }
}
