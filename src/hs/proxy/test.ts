import test = require('tape');

import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';

import {proxy} from './';

test('basic proxy', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    const proxied = proxy(hs, hv, n => n * 2);
    t.is(proxied.$, 0);

    hv.$ = 5;
    t.is(proxied.$, 10);
    t.end();
});

test('proxy write', t => {
    const hs = new HyperScope();
    const hv = new HyperValue([1, 2, 3]);
    const proxied = proxy(hs, hv, a => a.join('-'), s => s.split('-').map(Number));
    t.is(proxied.$, '1-2-3');

    hv.$ = [2, 4];
    t.is(proxied.$, '2-4');

    proxied.$ = '7-8-9';
    t.deepEqual(hv.$, [7, 8, 9]);
    t.end();
});

test('setting proxy must not write to target hv', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    let changed = false;

    hs.watch(hv, () => {
        if (!changed) {
            t.fail('hv was updated unexpectedly');
        }
    });

    const proxied = proxy(hs, hv, n => n * 2, o => o / 2);
    t.is(proxied.$, 0);

    changed = true;
    proxied.$ = 8;
    t.is(hv.$, 4);

    t.end();
});


