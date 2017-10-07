let recordedHv: HyperValue<any>[][] = [];
let recordingHv = false;

export interface Watcher<T> {
    (newValue: T, oldValue: T): void;
}

type HvArray<T> = Array<HyperValue<T>>;

type DepFn<T> = (params: HyperValue<any>[]) => T;

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

    watch(watcher: Watcher<T>) {
        this.watchers.push(watcher);
    }

    unwatch(watcher: Watcher<T>) {
        let index = this.watchers.indexOf(watcher);
        if (index === -1) {
            return;
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
    if (!newList) {
        throw new Error('recorder stack error');
    }
    return newList;
}

export function record<T>(fn: () => T): [T, HyperValue<any>[]] {
    hvRecordStart();
    const result = fn();
    return [result, hvRecordStop()];
}
