import test = require('tape');

import {HyperValue} from '../core';
import {hvAuto, hvBind, hvEval, hvMake, hvWrap, hvAsync} from '../helpers/tools';

test('instance created', t => {
    const hv = hvMake(0);
    t.true(hv instanceof HyperValue);
    t.end();
});

test('basic bind', t => {
    const hv = hvMake(0);
    const hv2 = hvMake(0);
    hvBind(hv, [hv2], () => {
        return hv2.g() + 1;
    });
    hv2.s(2);
    t.is(hv.g(), 3);
    t.end();
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
    t.end();
});

test('basic wrap', t => {
    const a = hvMake(5);
    const twice = hvWrap(a, n => n * 2);
    t.is(twice.g(), 10);
    a.s(3);
    t.is(twice.g(), 6);
    t.end();
});

test('basic auto', t => {
    const a = hvMake(5);
    const b = hvMake(5);
    const sum = hvAuto(() => a.g() + b.g());
    t.is(sum.g(), 10);
    a.s(3);
    t.is(sum.g(), 8);
    t.end();
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
    t.end();
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
    t.end();
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
    t.end();
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
    t.end();
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
    t.end();
});

test('auto watchers limit same deps', t => {
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
    t.end();
});

test('auto watchers limit different deps', t => {
    const a = hvMake(0);
    const b = hvMake(0);

    hvAuto(() => {
        return a.g() + b.g();
    });

    a.watch(() => {
        const lenA = (a as any).watchers.length;
        const lenB = (b as any).watchers.length;
        if (lenA > 10 || lenB > 10) {
            t.fail();
        }
    });

    for (let i = 0; i < 5; i++) {
        a.s(i);
        b.s(i);
    }

    t.pass();
    t.end();
});

function wait(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    });
}

async function returnDelayed<T>(value: T, ms: number): Promise<T> {
    await wait(ms);
    return value;
}

test('hvAsync basic', async t => {
    const a = new HyperValue(0);
    const b = await hvAsync(async w => {
        return await w(returnDelayed(a.g() * 2, 50));
    });

    t.is(b.g(), 0);
    a.s(2);
    t.is(b.g(), 0);
    await wait(75);
    t.is(b.g(), 4);
    t.end();
});

test('hvAsync ignore parallel writting', async t => {
    let callCount = 0;
    const a = new HyperValue(0);
    const b = new HyperValue(0);

    setTimeout(() => b.s(1), 10);

    const c = await hvAsync(async w => {
        callCount++;
        return await w(returnDelayed(a.g() * 2, 50));
    });

    t.is(b.g(), 1);
    t.is(c.g(), 0);
    a.s(2);
    t.is(c.g(), 0);
    await wait(75);
    t.is(c.g(), 4);
    t.is(callCount, 2);
    t.end();
});

test('hvAsync multi hv capturing', async t => {
    const a = new HyperValue(0);
    const b = new HyperValue(0);

    const c = await hvAsync(async w => {
        const argA = a.g() * 2;
        await w(returnDelayed(argA, 100));
        const argB = argA + b.g() * 2;
        return await w(returnDelayed(argB, 100));
    });

    t.is(c.g(), 0);
    a.s(2);
    t.is(c.g(), 0);
    await wait(150);
    t.is(c.g(), 0, 'not updated untill resolve');
    await wait(100);
    t.is(c.g(), 4, 'first update from a.s(2)');

    b.s(3);
    t.is(c.g(), 4);
    await wait(250);
    t.is(c.g(), 10);
    t.end();
});
