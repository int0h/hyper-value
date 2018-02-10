import test = require('tape');
import {HyperValue} from '../..';
import {ProxyScope} from '../../scopes/proxy';

test('basic proxy', t => {
    const hs = new ProxyScope();
    const hv = new HyperValue(0);
    const proxy = hs.proxy(hv, n => n * 2);
    t.is(proxy.$, 0);

    hv.$ = 5;
    t.is(proxy.$, 10);
    t.end();
});

test('proxy write', t => {
    const hs = new ProxyScope();
    const hv = new HyperValue([1, 2, 3]);
    const proxy = hs.proxy(hv, a => a.join('-'), s => s.split('-').map(Number));
    t.is(proxy.$, '1-2-3');

    hv.$ = [2, 4];
    t.is(proxy.$, '2-4');

    proxy.$ = '7-8-9';
    t.deepEqual(hv.$, [7, 8, 9]);
    t.end();
});

test('setting proxy must not write to target hv', t => {
    const hs = new ProxyScope();
    const hv = new HyperValue(0);
    let changed = false;

    hs.watch(hv, () => {
        if (!changed) {
            t.fail('hv was updated unexpectedly');
        }
    });

    const proxy = hs.proxy(hv, n => n * 2, o => o / 2);
    t.is(proxy.$, 0);

    changed = true;
    proxy.$ = 8;
    t.is(hv.$, 4);

    t.end();
});
