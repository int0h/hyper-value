import {HyperValue} from '../../core/core';
import {WatcherFn} from '../../core/dispatcher';
import {HyperScope} from '../../scopes';

/**
 * Applied to a hyper-value it observes any changes and invokes `fn` each time hyper-value changes.
 * @param hs HyperScope instance
 * @param hv hyper-value to be observed
 * @param fn a function to be called on changes
 * @returns return a WatcherId that can be used in `unwatch` helper
 */
export function watch<T>(hs: HyperScope, hv: HyperValue<T> | number, fn: WatcherFn<T>): number {
    return hs.watch(hv, fn);
}
