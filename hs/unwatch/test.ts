import test = require('tape');

import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';

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
