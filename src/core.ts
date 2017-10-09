let recordedHv: HyperValue<any>[][] = [];

export interface Watcher<T> {
    (newValue: T, oldValue: T): void;
}

export class HyperValue<T> {
    private watchers: (Watcher<T> | null)[] = [];
    private value: T;
    private newValue: T;
    private updating = false;

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

        this.watchers = this.watchers.filter(watcher => {
            return watcher !== null;
        });

        const cleanWatchers = [...this.watchers] as Watcher<T>[];

        for (let watcher of cleanWatchers) {
            watcher(newValue, this.value);
        }

        this.value = newValue;

        this.updating = false;
    }

    watch(watcher: Watcher<T>, ignoreDoubles?: boolean) {
        let found = this.hasWatcher(watcher);

        if (found) {
            if (ignoreDoubles) {
                return;
            }
            throw new Error('Cannot add existing watcher');
        }

        this.watchers.push(watcher);
    }

    unwatch(watcher: Watcher<T>) {
        const index = this.watchers.indexOf(watcher);

        if (!(index >= 0 && index < this.watchers.length)) {
            throw new Error(`Invalid watcher id: ${watcher}`);
        }

        this.watchers[index] = null;
    }

    hasWatcher(watcher: Watcher<T>): boolean {
        return this.watchers.indexOf(watcher) !== -1;
    }
}

function hvRecordStart() {
    recordedHv.push([]);
}

function hvRecordStop() {
    const newList = recordedHv.pop();
    return newList;
}

function addToRecords(hv: HyperValue<any>) {
    if (recordedHv.length <= 0) {
        return;
    }
    const currentList = recordedHv[recordedHv.length - 1];
    currentList.push(hv);
}

export function record<T>(fn: () => T): [T, HyperValue<any>[]] {
    hvRecordStart();
    const result = fn();
    return [result, hvRecordStop() as HyperValue<any>[]];
}
