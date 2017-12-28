import {HyperValue} from './core';

export let recordedHvStack: HyperValue<any>[][] = [];

export interface WatcherFn<T> {
    (newValue: T, oldValue: T): void;
}

export type WatcherId = number;

function hvRecordStart() {
    recordedHvStack.push([]);
}

function hvRecordStop(): HyperValue<any>[] {
    const newList = recordedHvStack.pop();
    return newList as HyperValue<any>[];
}

export function addToRecords(hv: HyperValue<any>) {
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
    return [result, hvRecordStop()];
}

export type PromiseWrapper = <T>(p: Promise<T>) => Promise<T>;

export function recordAsync<T>(
    fn: (w: PromiseWrapper) => Promise<T>,
    noNewDeps?: (deps: HyperValue<any>[]) => void
): Promise<[T, HyperValue<any>[]]> {

    return new Promise((resolve) => {
        let deps = [] as HyperValue<any>[];

        function w<T>(p: Promise<T>): Promise<T> {
            return new Promise((resolve) => {
                const newDeps = hvRecordStop();

                deps = deps.concat(newDeps);
                if (noNewDeps) {
                    noNewDeps(newDeps);
                }

                p.then(value => {
                    hvRecordStart();
                    resolve(value);
                });
            });
        }

        hvRecordStart();
        fn(w).then(value => {
            const finalDeps = [...deps, ...hvRecordStop()];

            if (noNewDeps) {
                noNewDeps(deps);
            }

            resolve([value, finalDeps]);
        });

    });
}
