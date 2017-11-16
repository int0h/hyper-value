import test = require('tape');
import {HyperValue, record} from '../core';

test('instance created', t => {
    const hv = new HyperValue(0);
    t.true(hv instanceof HyperValue);
    t.end();
});

test('watcher works', t => {
    const hv = new HyperValue(0);
    hv.watch(() => {
        t.pass();
        t.end();
    });
    hv.s(1);
});

test('watcher gets values', t => {
    const hv = new HyperValue(0);
    hv.watch((newValue, oldValue) => {
        t.is(newValue, 1);
        t.is(oldValue, 0);
        t.end();
    });
    hv.s(1);
});

test('hv can be unwatched', t => {
    const hv = new HyperValue(0);
    const watcher = () => t.fail();
    const id = hv.watch(watcher);
    hv.unwatch(id);
    hv.s(1);
    t.pass();
    t.end();
});

// test('hv can be unwatched by watcher function', t => {
//     const hv = new HyperValue(0);
//     const watcher = () => t.fail();
//     hv.watch(watcher);
//     hv.unwatch(watcher);
//     hv.s(1);
//     t.pass();
// });

// test('throws on attempt of deleting non existing watcher', t => {
//     const hv = new HyperValue(0);
//     t.throws(() => {
//         hv.unwatch(() => {});
//     });
// });

// test('throws on attempt of adding a watcher twice', t => {
//     const hv = new HyperValue(0);
//     const watcher = () => t.fail();
//     t.throws(() => {
//         hv.watch(watcher);
//         hv.watch(watcher);
//     });
// });

// test('allows adding a watcher twice by explicit option', t => {
//     const hv = new HyperValue(0);
//     const watcher = () => t.fail();
//     t.notThrows(() => {
//         hv.watch(watcher, true);
//         hv.watch(watcher, true);
//     });
// });

// test('allows adding a watcher twice by explicit option', t => {
//     const hv = new HyperValue(0);
//     const watcher = () => t.fail();
//     hv.watch(watcher, true);
//     hv.watch(watcher, true);
//     t.true(hv.hasWatcher(watcher));
// });

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
    const hv = new HyperValue(0);

    hv.watch(() => {
        hv.s(hv.g() + 1);
    });

    hv.s(1);

    t.is(hv.g(), 1);
    t.end();
});
