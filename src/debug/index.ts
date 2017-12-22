import {BaseScope} from '../scopes/base';

let toBeReported: {obj: any, msg: string}[] = [];

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

function report(obj: any, msg: string) {
    if (toBeReported.length === 0) {
        setTimeout(outputWarns, 1000);
    }

    toBeReported.push({obj, msg});
}

function outputWarns() {
    if (toBeReported.length === 0) {
        return;
    }

    const objList: BaseScope[] = [];
    const warns = toBeReported.filter(({obj}) => {
        const has = objList.indexOf(obj) !== -1;
        if (!has) {
            objList.push(obj);
        }
        return !has;
    });
    for (const w of warns) {
        console.warn(w.msg, w.obj, w.obj._debug);
    }

    toBeReported = [];
}
