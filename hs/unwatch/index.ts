import {HyperValue} from '../../core/core';
import {HyperScope} from '../../scopes';

export function unwatch(hs: HyperScope, hv: HyperValue<any> | number, watcherId: number, tolerate?: boolean) {
    return hs.unwatch(hv, watcherId, tolerate);
}
