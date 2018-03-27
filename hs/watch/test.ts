import test = require('tape');

import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';

import {watch} from './';

test('basic watch', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    watch(hs, hv, () => {
        t.pass();
        t.end();
    });
    hv.$ = 2;
});

test('basic free', t => {
    const hs = new HyperScope();
    const hv1 = new HyperValue(0);
    const hv2 = new HyperValue(0);
    watch(hs, hv1, () => {
        t.fail();
    });
    watch(hs, hv2, () => {
        t.fail();
    });
    hs.free();
    hv1.$ = 2;
    hv2.$ = 2;
    t.pass();
    t.end();
});

test('still globally throws', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    watch(hs, hv, () => {
        throw new Error('bad');
    });
    t.throws(() => {
        hv.$ = 1;
    });
    t.end();
});
