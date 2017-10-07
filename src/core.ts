let recordedHv: HyperValue<any>[][] = [];
let recordingHv = false;

export interface Watcher<T> {
    (newValue: T, oldValue: T): void;
}

export class HyperValue<T> {
    watchers: Watcher<T>[] = [];
    value: T;
    newValue: T;
    updating = false;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    g(silent?: boolean): T {
        if (recordingHv && !silent) {
            const currentList = recordedHv[recordedHv.length - 1];
            currentList.push(this);
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
        for (let watcher of this.watchers) {
            watcher(newValue, this.value);
        }
        this.value = newValue;
        this.updating = false;
    }

    watch(watcher: Watcher<T>): number {
        this.watchers.push(watcher);
        return this.watchers.length - 1;
    }

    unwatch(watcher: Watcher<T> | number) {
        const index = typeof watcher === 'function'
            ? this.watchers.indexOf(watcher)
            : watcher;
        if (!(index >= 0 && index < this.watchers.length)) {
            throw new Error(`Invalid watcher id: ${watcher}`);
        }
        this.watchers.splice(index, 1);
    }
}

function hvRecordStart() {
    recordedHv.push([]);
    recordingHv = true;
}

function hvRecordStop() {
    recordingHv = false;
    const newList = recordedHv.pop();
    return newList;
}

export function record<T>(fn: () => T): [T, HyperValue<any>[]] {
    hvRecordStart();
    const result = fn();
    return [result, hvRecordStop() as HyperValue<any>[]];
}
