import test = require('tape');
import {record} from '../../core';
import {globalDispatcher} from '../../core/dispatcher';
import {HyperValue, scopes} from '../..';

test('instance created', t => {
    const hv = new HyperValue(0);
    t.true(hv instanceof HyperValue);
    t.end();
});

test('watcher works', t => {
    const hs = new scopes.FullScope();
    const hv = new HyperValue(0);
    hs.watch(hv, () => {
        t.pass();
        t.end();
    });
    hv.s(1);
});

test('watcher gets values', t => {
    const hs = new scopes.FullScope();
    const hv = new HyperValue(0);
    hs.watch(hv, (newValue, oldValue) => {
        t.is(newValue, 1);
        t.is(oldValue, 0);
        t.end();
    });
    hv.s(1);
});

test('hv can be unwatched', t => {
    const hs = new scopes.FullScope();
    const hv = new HyperValue(0);
    const watcher = () => t.fail();
    const id = hs.watch(hv, watcher);
    hs.unwatch(hv, id);
    hv.s(1);
    t.pass();
    t.end();
});

test('dispatcher unwatch with invalid ID', t => {
    const hv = new HyperValue(0);
    t.throws(() => {
        globalDispatcher.unwatch(hv.id, 123);
    });
    t.end();
});

test('record basics', t => {
    const hv = new HyperValue(0);

    const [value, deps] = record(() => {
        return hv.g();
    });

    t.is(value, 0);
    t.deepEqual(deps, [hv]);
    t.end();
});

test('record and silent get', t => {
    const hv = new HyperValue(0);

    const [value, deps] = record(() => {
        return hv.g(true);
    });

    t.is(value, 0);
    t.deepEqual(deps, []);
    t.end();
});


test('ignore cycle links', t => {
    const hs = new scopes.FullScope();
    const hv = new HyperValue(0);

    hs.watch(hv, () => {
        hv.s(hv.g() + 1);
    });

    hv.s(1);

    t.is(hv.g(), 1);
    t.end();
});
