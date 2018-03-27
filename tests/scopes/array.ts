import test = require('tape');
import {HyperValue} from '../..';
import {ArrayScope} from '../../scopes/array';


test('array some', t => {
    const hs = new ArrayScope();
    const hv = new HyperValue([1, 2, 3]);
    const hasEvens = hs.some(hv, i => i % 2 === 0);

    t.true(hasEvens.$);
    hv.$ = [1, 3];

    t.false(hasEvens.$);

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
