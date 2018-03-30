import test = require('tape');

import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';

import {auto} from '../auto';
import {watch} from '../watch';
import {unwatch} from './';

test('basic unwatch', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    const watcherId = watch(hs, hv, () => {
        t.fail();
    });
    unwatch(hs, hv, watcherId);
    hv.$ = 2;
    t.pass();
    t.end();
});

test('unwatch with invalid ID', t => {
    const hs = new HyperScope();
    t.throws(() => {
        hs.unwatch(123, 123);
    });
    t.end();
});

test('tolerate unwatch in auto', t => {
    const gs = new HyperScope();

    const keys = new HyperValue(3);

    let renderHs = new HyperScope();

    auto(gs, () => {
        renderHs.free();
        renderHs = new HyperScope();
        const a = auto(renderHs, () => keys.$ && 1);
        auto(renderHs, () => keys.$ && 1);
        a.g();
    });

    keys.$ = 33;
    t.pass();
    t.end();
});
