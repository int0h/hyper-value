import {HyperValue} from '../../core/core';
import {HyperScope} from '../../scopes';

/**
 * Removes specified `watcher` from specified hyper-value
 * @param hs HyperScope instance
 * @param hv hyper-value that is observed
 * @param watcherId id of watcher to be deleted; it can be obtained from `watch` helper
 */
export function unwatch(hs: HyperScope, hv: HyperValue<any> | number, watcherId: number, tolerate?: boolean) {
    return hs.unwatch(hv, watcherId, tolerate);
}
