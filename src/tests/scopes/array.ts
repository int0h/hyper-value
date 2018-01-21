import test = require('tape');
import {HyperValue} from '../..';
import {ArrayScope} from '../../scopes/array';

test('array length', t => {
    const hs = new ArrayScope();
    const hv = new HyperValue([1, 2, 3]);
    const len = hs.length(hv);

    t.is(len.$, 3);

    hv.$ = [1, 2, 3, 4];
    t.is(len.$, 4);

    t.end();
});

test('array map', t => {
    const hs = new ArrayScope();
    const hv = new HyperValue([1, 2, 3]);
    const mapped = hs.map(hv, i => i * 2);

    t.deepEqual(mapped.$, [2, 4, 6]);

    hv.$ = [7, 8, 9];
    t.deepEqual(mapped.$, [14, 16, 18]);

    t.end();
});

test('array filter', t => {
    const hs = new ArrayScope();
    const hv = new HyperValue([1, 2, 3]);
    const filtered = hs.filter(hv, i => i % 2 === 0);

    t.deepEqual(filtered.$, [2]);

    hv.$ = [1, 2, 3, 4];
    t.deepEqual(filtered.$, [2, 4]);

    t.end();
});

test('array some', t => {
    const hs = new ArrayScope();
    const hv = new HyperValue([1, 2, 3]);
    const hasEvens = hs.some(hv, i => i % 2 === 0);

    t.true(hasEvens.$);
    hv.$ = [1, 3];

    t.false(hasEvens.$);

    t.end();
});

test('array every', t => {
    const hs = new ArrayScope();
    const hv = new HyperValue([1, 2, 3]);
    const everyIsEven = hs.every(hv, i => i % 2 === 0);

    t.false(everyIsEven.$);

    hv.$ = [4, 2, 6];
    t.true(everyIsEven.$);

    t.end();
});

test('array reduce', t => {
    const hs = new ArrayScope();
    const hv = new HyperValue([1, 2, 3]);
    const sum = hs.reduce(hv, (sum, i) => sum + i);

    t.is(sum.$, 6);

    hv.$ = [1, 2, 3, 4];
    t.is(sum.$, 10);

    t.end();
});

test('array concat2', t => {
    const hs = new ArrayScope();
    const a1 = new HyperValue([1, 2, 3]);
    const a2 = new HyperValue([4, 5, 6]);
    const joined = hs.concat(a1, a2);

    t.deepEqual(joined.$, [1, 2, 3, 4, 5, 6]);

    a1.$ = [1, 9, 3];
    t.deepEqual(joined.$, [1, 9, 3, 4, 5, 6]);

    a2.$ = [4, 9, 6];
    t.deepEqual(joined.$, [1, 9, 3, 4, 9, 6]);

    t.end();
});

test('array slice', t => {
    const hs = new ArrayScope();
    const arr = new HyperValue([1, 2, 3, 4, 5]);
    const s = new HyperValue(1);
    const e = new HyperValue(3);
    const sliced = hs.slice(arr, s, e);

    t.deepEqual(sliced.$, [2, 3]);

    s.$ = 2;
    t.deepEqual(sliced.$, [3]);

    e.$ = 5;
    t.deepEqual(sliced.$, [3, 4, 5]);

    t.end();
});

test('array insert', t => {
    const hs = new ArrayScope();
    const arr = new HyperValue([1, 2, 3]);

    hs.insert(arr, 0, 0);
    t.deepEqual(arr.$, [0, 1, 2, 3], 'insert in the beginning');

    hs.insert(arr, Infinity, 4);
    t.deepEqual(arr.$, [0, 1, 2, 3, 4], 'insert in the end');

    hs.insert(arr, -1, 3.5);
    t.deepEqual(arr.$, [0, 1, 2, 3, 3.5, 4], 'negative index');

    hs.insert(arr, 0, [-2, -1]);
    t.deepEqual(arr.$, [-2, -1, 0, 1, 2, 3, 3.5, 4], 'insert a few');

    t.end();
});

test('array remove', t => {
    const hs = new ArrayScope();
    const arr = new HyperValue([1, 2, 3, 4, 5]);

    hs.remove(arr, 0, 1);
    t.deepEqual(arr.$, [2, 3, 4, 5], 'remove from the beginning');

    hs.remove(arr, -1, 1);
    t.deepEqual(arr.$, [2, 3, 4], 'remove from in the end');

    hs.remove(arr, 0, 2);
    t.deepEqual(arr.$, [4], 'remove a few');

    t.end();
});

test('array sort', t => {
    const hs = new ArrayScope();
    const arr = new HyperValue([4, 3, 2, 5, 1]);
    const sorted = hs.sort(arr);

    t.deepEqual(sorted.$, [1, 2, 3, 4, 5]);

    arr.$ = [7, 9, 8];
    t.deepEqual(sorted.$, [7, 8, 9]);

    const descSorted = hs.sort(arr, (a, b) => b - a);
    t.deepEqual(descSorted.$, [9, 8, 7]);

    t.deepEqual(arr.$, [7, 9, 8], 'make sure that original array is kept intact');

    t.end();
});
