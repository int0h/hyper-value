import test = require('tape');
import {HyperValue, hvAuto, HvScope} from '..';
import weak = require('weak');

declare function gc(): void;

test('weak works', t => {
    let obj: {a: number} | null = {a: 2};
    const wr = weak(obj, () => {
        console.log('f00');
        t.end();
    });

    t.is(weak.isWeakRef(wr), true);

    t.deepEqual(weak.get(wr), {a: 2});

    obj = null;
    gc();

    t.is(weak.get(wr), undefined);

    if (weak.isDead(wr)) {
        const val = weak.get(wr);
        t.is(val, undefined);
    }
});

type NullableHv = HyperValue<number> | null;

test('watchers are kept source hv', t => {
    const hv = new HyperValue(0);
    let func: any = () => {};
    const wFunc = weak(func);
    const watcherId = hv.watch(func);
    func = null;
    gc();
    t.is(weak.isDead(wFunc), false);

    // unwatch fixes it
    hv.unwatch(watcherId);
    gc();
    t.is(weak.isDead(wFunc), true);
    t.end();
});

test('source wathcers keep subscribers', t => {
    let source: NullableHv = new HyperValue(0);
    let subscriber: NullableHv = hvAuto(() => (source as HyperValue<number>).g() * 100);
    const ws = weak(subscriber as HyperValue<number>);
    subscriber = null;
    gc();
    t.is(weak.isDead(ws), false);

    // deleting source leads to proper gc
    source = null;
    gc();
    t.is(weak.isDead(ws), true);
    t.end();
});

test('subscriber free', t => {
    let source: NullableHv = new HyperValue(0);
    let subscriber: NullableHv = hvAuto(() => (source as HyperValue<number>).g() * 100);
    const ws = weak(subscriber as HyperValue<number>);
    subscriber.free();
    subscriber = null;
    gc();
    t.is(weak.isDead(ws), true);
    t.end();
});

test('hvScope basics', t => {
    const scope = new HvScope();
    let a: NullableHv = scope.hv(1);
    let b: NullableHv = scope.hv(2);
    let outOfScope = new HyperValue(3);
    let c: NullableHv = scope.hvAuto(() => (a as HyperValue<number>).g() * outOfScope.g());
    const wa = weak(a);
    const wb = weak(b);
    const wc = weak(c);
    a = null;
    b = null;
    c = null;
    scope.free();
    gc();
    t.is(weak.isDead(wa), true);
    t.is(weak.isDead(wb), true);
    t.is(weak.isDead(wc), true);
    t.end();
});
