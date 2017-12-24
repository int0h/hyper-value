import {HyperValue} from '../core';

interface HistoryItem {
    depth: number;
    state: 'pend' | 'done';
    hv: HyperValue<any>;
}

let currentDepth = 0;
let history: HistoryItem[] = [];

function pipeLog<T>(hv: any, fn: () => T): T {
    history.push({
        depth: currentDepth,
        hv,
        state: 'pend'
    });
    currentDepth++;
    const result = fn();
    currentDepth--;
    history.push({
        depth: currentDepth,
        hv,
        state: 'done'
    });
    return result;
}

export function hvDebug(target: {new (...args: any[]): any}) {
    return class HyperValue extends target {
        _debug = new Error('');
        // _name = getName(this._debug.stack || '');

        s(...args: any[]) {
            return pipeLog(this, () => {
                return super.s(...args);
            });
        }
    } as any as typeof HyperValue;
}

declare const global: any;
declare const window: any;

const glob = typeof global !== 'undefined'
    ? global
    : window;

glob.getHvHistory = () => {
    return 'log:\n' + history.map(item => {
        const sign = item.state === 'done' ? '\\' : '/';
        // const name = getName((item.hv as any)._debug.stack);
        const name = item.hv.id;
        return '|   '.repeat(item.depth) + `${sign}: ${name}`;
    }).join('\n');
};
