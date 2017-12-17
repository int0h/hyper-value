import test = require('tape');
import {HyperValue} from '../..';
import {BaseScope} from '../../scopes/base';

test('basic watch', t => {
    const hs = new BaseScope();
    const hv = new HyperValue(0);
    hs.watch(hv, () => {
        t.pass();
        t.end();
    });
    hv.$ = 2;
});

test('basic unwatch', t => {
    const hs = new BaseScope();
    const hv = new HyperValue(0);
    const watcherId = hs.watch(hv, () => {
        t.fail();
    });
    hs.unwatch(hv, watcherId);
    hv.$ = 2;
    t.pass();
    t.end();
});

test('basic free', t => {
    const hs = new BaseScope();
    const hv1 = new HyperValue(0);
    const hv2 = new HyperValue(0);
    hs.watch(hv1, () => {
        t.fail();
    });
    hs.watch(hv2, () => {
        t.fail();
    });
    hs.free();
    hv1.$ = 2;
    hv2.$ = 2;
    t.pass();
    t.end();
});

test('unwatch with invalid ID', t => {
    const hs = new BaseScope();
    t.throws(() => {
        hs.unwatch(123, 123);
    });
    t.end();
});
