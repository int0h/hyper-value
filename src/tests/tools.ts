import test from 'ava';
import {HyperValue} from '../core';
import {hvAuto, hvBind, hvEval, hvMake, hvWrap} from '../helpers/tools';

test('instance created', t => {
    const hv = hvMake(0);
    t.true(hv instanceof HyperValue);
});

test('basic bind', t => {
    const hv = hvMake(0);
    const hv2 = hvMake(0);
    hvBind(hv, [hv2], () => {
        return hv2.g() + 1;
    });
    hv2.s(2);
    t.is(hv.g(), 3);
});

test('basic bind', t => {
    const a = hvMake(5);
    const b = hvMake(5);
    const sum = hvEval([a, b], () => {
        return a.g() + b.g();
    });
    t.is(sum.g(), 10);
    a.s(10);
    t.is(sum.g(), 15);
});

test('basic wrap', t => {
    const a = hvMake(5);
    const twice = hvWrap(a, n => n * 2);
    t.is(twice.g(), 10);
    a.s(3);
    t.is(twice.g(), 6);
});

test('basic auto', t => {
    const a = hvMake(5);
    const b = hvMake(5);
    const sum = hvAuto(() => a.g() + b.g());
    t.is(sum.g(), 10);
    a.s(3);
    t.is(sum.g(), 8);
});

test('auto multiple call', t => {
    const a = hvMake(0);
    const exp = hvAuto(() => a.g());
    t.is(exp.g(), 0);
    a.s(1);
    t.is(exp.g(), 1);
    a.s(2);
    t.is(exp.g(), 2);
    a.s(3);
    t.is(exp.g(), 3);
});

test('auto multiple deps', t => {
    const a = hvMake(1);
    const b = hvMake(2);
    const exp = hvAuto(() => a.g() || b.g());
    t.is(exp.g(), 1);
    a.s(0);
    t.is(exp.g(), 2);
    a.s(3);
    t.is(exp.g(), 3);
});

test('nested auto and get', t => {
    const a = hvMake(0);
    const b = hvMake(0);
    const exp = hvAuto(() => hvAuto(() => a.g()).g() + b.g());
    t.is(exp.g(), 0);
    a.s(1);
    t.is(exp.g(), 1);
    b.s(2);
    t.is(exp.g(), 3);
});

test('multi auto with the same dep', t => {
    const v = hvMake(0);
    const a1 = hvAuto(() => v.g());
    const a2 = hvAuto(() => v.g());
    t.is(a1.g(), 0);
    t.is(a2.g(), 0);
    v.s(1);
    t.is(a1.g(), 1);
    t.is(a2.g(), 1);
    v.s(2);
    t.is(a1.g(), 2);
    t.is(a2.g(), 2);
});

test('watchOnce fired only once', t => {
    const a = hvMake(5);
    a.watch(val => {
        if (val === 1) {
            t.fail();
        }
    }, true);
    a.s(0);
    a.s(1);
    t.pass();
});

test('auto watchers limit', t => {
    const a = hvMake(0);

    hvAuto(() => {
        return a.g() + a.g();
    });

    a.watch(() => {
        const len = (a as any).watchers.length;
        if (len > 10) {
            t.fail();
        }
    });

    for (let i = 0; i < 10; i++) {
        a.s(i);
    }

    t.pass();
});