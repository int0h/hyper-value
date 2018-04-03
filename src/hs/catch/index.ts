import {HyperValue} from '../../core/core';
import {Catcher} from '../../core/dispatcher';
import {HyperScope} from '../../scopes';

/**
 * Allows to catch errors that can occur in watchers or `auto` functions
 * @param hs HyperScope instance
 * @param hv hyper-value that may cause error
 * @param catcher a function that handles errors
 */
export function catchError(hs: HyperScope, hv: HyperValue<any> | number, catcher: Catcher) {
    return hs.catch(hv, catcher);
}
