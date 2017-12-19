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

test('hvAsync basic', async t => {
    const hs = new AsyncScope();
    const a = new HyperValue(0);
    const b = await hs.async(null, async w => {
        return await w(returnDelayed(a.g() * 2, 50));
    }).fetch();

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

    const c = await hs.async(null, async w => {
        callCount++;
        return await w(returnDelayed(a.g() * 2, 50));
    }).fetch();

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

    const c = await hs.async(null, async w => {
        const argA = a.g() * 2;
        await w(returnDelayed(argA, 100));
        const argB = argA + b.g() * 2;
        return await w(returnDelayed(argB, 100));
    }).fetch();

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
    const a = hs.async(null, async w => {
        return await w(returnDelayed(3, 100));
    });

    t.is(a.g(), null);
    await wait(150);
    t.is(a.g(), 3);
    t.end();
});

test('hvAsync sync: init value', async t => {
    const hs = new AsyncScope();
    const a = hs.async(1, async w => {
        return await w(returnDelayed(3, 100));
    });

    t.is(a.g(), 1);
    await wait(150);
    t.is(a.g(), 3);
    t.end();
});
