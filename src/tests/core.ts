import test from 'ava';
import {HyperValue, record} from '../core';

test('instance created', t => {
    const hv = new HyperValue(0);
    t.true(hv instanceof HyperValue);
});

test('watcher works', t => {
    const hv = new HyperValue(0);
    hv.watch(() => {
        t.pass();
    });
    hv.s(1);
});

test('watcher gets values', t => {
    const hv = new HyperValue(0);
    hv.watch((newValue, oldValue) => {
        t.is(newValue, 1);
        t.is(oldValue, 0);
    });
    hv.s(1);
});

test('hv can be unwatched', t => {
    const hv = new HyperValue(0);
    const id = hv.watch(() => t.fail());
    hv.unwatch(id);
    hv.s(1);
    t.pass();
});

test('hv can be unwatched by watcher function', t => {
    const hv = new HyperValue(0);
    const watcher = () => t.fail();
    hv.watch(watcher);
    hv.unwatch(watcher);
    hv.s(1);
    t.pass();
});

test('throws on attempt of deleting non existing watcher', t => {
    const hv = new HyperValue(0);
    t.throws(() => {
        hv.unwatch(0);
    });
});

test('record basics', t => {
    const hv = new HyperValue(0);

    const [value, deps] = record(() => {
        return hv.g();
    });

    t.is(value, 0);
    t.deepEqual(deps, [hv]);
});

test('record and silent get', t => {
    const hv = new HyperValue(0);

    const [value, deps] = record(() => {
        return hv.g(true);
    });

    t.is(value, 0);
    t.deepEqual(deps, []);
});


test('ignore cycle links', t => {
    const hv = new HyperValue(0);

    hv.watch(() => {
        hv.s(hv.g() + 1);
    });

    hv.s(1);

    t.is(hv.g(), 1);
});
