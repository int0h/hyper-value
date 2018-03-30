import test = require('tape');

import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';

import {wait} from './';

test('wait default', t => {
    const hs = new HyperScope();
    const hv = new HyperValue<undefined | number>(undefined);
    let ready = false;
    t.plan(2);

    wait(hs, hv).then(hv => {
        t.is(hv.$, 2);
        if (ready) {
            t.pass();
        } else {
            t.fail();
        }
    });

    ready = true;
    hv.$ = 2;
});

test('wait value', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    let ready = false;
    t.plan(2);

    wait(hs, hv, 3 as 3).then(hv => {
        t.is(hv.$, 3);
        if (ready) {
            t.pass();
        } else {
            t.fail();
        }
    });

    hv.$ = 2;

    ready = true;
    hv.$ = 3;
});

test('wait function', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    let ready = false;
    t.plan(2);

    wait(hs, hv, i => i > 4).then(hv => {
        t.is(hv.$, 5);
        if (ready) {
            t.pass();
        } else {
            t.fail();
        }
    });

    hv.$ = 2;

    ready = true;
    hv.$ = 5;
});

test('wait catch', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    let ready = false;
    t.plan(2);

    wait(hs, hv, i => i > 4, i => i < 0)
        .then(() => {
            t.fail();
        })
        .catch(() => {
            t.is(hv.$, -1);
            if (ready) {
                t.pass();
            } else {
                t.fail();
            }
        });

    hv.$ = 2;

    ready = true;
    hv.$ = -1;
});
