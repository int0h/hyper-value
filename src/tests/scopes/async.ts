import test = require('tape');
import {HyperValue} from '../..';
import {AsyncScope} from '../../scopes/async';

function wait(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => resolve(), ms);
    });
}

async function returnDelayed<T>(value: T, ms: number): Promise<T> {
    await wait(ms);
    return value;
}

async function throwDelayed(msg: string, ms: number): Promise<void> {
    await wait(ms);
    throw new Error(msg);
}

test('hvAsync basic', async t => {
    const hs = new AsyncScope();
    const a = new HyperValue(0);
    const b = await hs.async({get: async w => {
        return await w(returnDelayed(a.g() * 2, 50));
    }}).wait();

    t.is(b.g(), 0);
    a.s(2);
    t.is(b.g(), 0);
    await wait(75);
    t.is(b.g(), 4);
    t.end();
});

test('hvAsync ignore parallel writting', async t => {
    const hs = new AsyncScope();
    let callCount = 0;
    const a = new HyperValue(0);
    const b = new HyperValue(0);

    setTimeout(() => b.s(1), 10);

    const c = await hs.async({get: async w => {
        callCount++;
        return await w(returnDelayed(a.g() * 2, 50));
    }}).wait();

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
    const hs = new AsyncScope();
    const a = new HyperValue(0);
    const b = new HyperValue(0);

    const c = await hs.async({get: async w => {
        const argA = a.g() * 2;
        await w(returnDelayed(argA, 100));
        const argB = argA + b.g() * 2;
        return await w(returnDelayed(argB, 100));
    }}).wait();

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

test('hvAsync sync', async t => {
    const hs = new AsyncScope();
    const a = hs.async({get: async w => {
        return await w(returnDelayed(3, 100));
    }});

    t.is(a.g(), undefined);
    await wait(150);
    t.is(a.g(), 3);
    t.end();
});

test('hvAsync sync: init value', async t => {
    const hs = new AsyncScope();
    const a = hs.async({initial: 1, get: async w => {
        return await w(returnDelayed(3, 100));
    }});

    t.is(a.g(), 1);
    await wait(150);
    t.is(a.g(), 3);
    t.end();
});

test('hvAsync: proper order of values', async t => {
    let calledTimes = 0;
    const hs = new AsyncScope();
    const a = new HyperValue(5);

    const b = hs.async({get: async w => {
        return calledTimes++ < 1
            ? await w(returnDelayed(a.$ * 1, 100))
            : await w(returnDelayed(a.$ * 2, 10));
    }});

    a.$ = 10;
    t.is(b.g(), undefined);
    await wait(20);
    t.is(b.$, 20);
    await wait(150);
    t.is(b.$, 20);
    t.end();
});

test('hvAsync: state', async t => {
    const hs = new AsyncScope();

    const a = hs.async({get: async w => {
        return await w(returnDelayed(1, 10));
    }});

    t.is(a.g(), undefined);
    t.is(a.state.$, 'pending');
    await wait(20);
    t.is(a.g(), 1);
    t.is(a.state.$, 'resolved');
    t.end();
});

test('hvAsync: throw', async t => {
    const hs = new AsyncScope();

    const a = hs.async({get: async w => {
        return await w(throwDelayed('err', 10));
    }});

    t.is(a.g(), undefined);
    t.is(a.state.$, 'pending');
    await wait(20);
    t.is(a.g(), undefined);
    t.is(a.state.$, 'rejected');
    t.end();
});

test('hvAsync: throw catch (async-await style)', async t => {
    t.plan(2);

    const hs = new AsyncScope();

    const a = hs.async({get: async w => {
        return await w(throwDelayed('err', 10));
    }});

    try {
        await a.wait();
    } catch (err) {
        t.is(err.message, 'err');
        t.pass();
    }
});

test('hvAsync: throw catch (promise style)', async t => {
    t.plan(2);

    const hs = new AsyncScope();

    const a = hs.async({get: async w => {
        return await w(throwDelayed('err', 10));
    }});

    a.wait().catch(err => {
        t.is(err.message, 'err');
        t.pass();
    });
});

test('hvAsync: hv catch', async t => {
    t.plan(2);

    const hs = new AsyncScope();

    const a = hs.async({get: async w => {
        return await w(throwDelayed('err', 10));
    }});

    hs.catch(a, error => {
        t.is(error.message, 'err');
        t.pass();
    });

    await wait(20);
});

test('hvAsync: getter is optional', async t => {
    const hs = new AsyncScope();

    const a = hs.async({initial: 1});

    t.is(a.$, 1);
    a.$ = 2;
    t.is(a.$, 2);
    t.end();
});

test('hvAsync: update basics', async t => {
    const hs = new AsyncScope();

    const a = hs.async({update: async () => returnDelayed(42, 10)});

    t.is(a.$, undefined);
    t.is(a.state.$, 'resolved');
    await wait(20);
    t.is(a.$, undefined);
    a.$ = 2;
    t.is(a.state.$, 'pending');
    t.is(a.$, undefined);
    await wait(20);
    t.is(a.state.$, 'resolved');
    t.is(a.$, 42);
    t.end();
});

test('hvAsync: setter basics', async t => {
    const hs = new AsyncScope();

    const a = hs.async({set: async () => wait(10)});

    t.is(a.$, undefined);
    t.is(a.state.$, 'resolved');
    await wait(20);
    t.is(a.$, undefined);
    a.$ = 2;
    t.is(a.state.$, 'pending');
    t.is(a.$, undefined);
    await wait(20);
    t.is(a.state.$, 'resolved');
    t.is(a.$, 2);
    t.end();
});
