import test from 'ava';
import {HyperValue} from '../core';
import {hvAuto, hvBind, hvEval, hvMake, wrapHv} from '../helpers/tools';

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
    const twice = wrapHv(a, n => n * 2);
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
