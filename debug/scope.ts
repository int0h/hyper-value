import {BaseScope} from '../scopes/base';
import {report} from '.';

export function scopeDebug(target: {new (...args: any[]): any}) {
    return class BaseScope extends target {
        _debug = new Error('');
        _watcherCount = 0;

        watch(...args: any[]) {
            this._watcherCount++;

            if (this._watcherCount > 100) {
                report(this, `scope watchers over limit: ${this._watcherCount} ws`);
            }

            return super.watch(...args);
        }

        unwatch(...args: any[]) {
            this._watcherCount--;
            return super.unwatch(...args);
        }
    } as any as typeof BaseScope;
}
