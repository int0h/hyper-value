import {HyperValue} from '../../core/core';
import {WatcherFn} from '../../core/dispatcher';
import {HyperScope} from '../../scopes';

export function watch<T>(hs: HyperScope, hv: HyperValue<T> | number, fn: WatcherFn<T>) {
    return hs.watch(hv, fn);
}
