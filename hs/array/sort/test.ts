import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {sort} from './';

test('array sort', t => {
    const hs = new HyperScope();
    const arr = new HyperValue([4, 3, 2, 5, 1]);
    const sorted = sort(hs, arr);

    t.deepEqual(sorted.$, [1, 2, 3, 4, 5]);

    arr.$ = [7, 9, 8];
    t.deepEqual(sorted.$, [7, 8, 9]);

    const descSorted = sort(hs, arr, (a, b) => b - a);
    t.deepEqual(descSorted.$, [9, 8, 7]);

    t.deepEqual(arr.$, [7, 9, 8], 'make sure that original array is kept intact');

    t.end();
});
