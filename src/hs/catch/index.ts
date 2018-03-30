import {HyperValue} from '../../core/core';
import {Catcher} from '../../core/dispatcher';
import {HyperScope} from '../../scopes';

export function catchError(hs: HyperScope, hv: HyperValue<any> | number, catcher: Catcher) {
    return hs.catch(hv, catcher);
}
