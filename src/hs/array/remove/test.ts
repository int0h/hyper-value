import test = require('tape');

import {HyperValue} from '../../../core';

import {remove} from './';

test('array remove', t => {
    const arr = new HyperValue([1, 2, 3, 4, 5]);

    remove(arr, 0, 1);
    t.deepEqual(arr.$, [2, 3, 4, 5], 'remove from the beginning');

    remove(arr, -1, 1);
    t.deepEqual(arr.$, [2, 3, 4], 'remove from in the end');

    remove(arr, 0, 2);
    t.deepEqual(arr.$, [4], 'remove a few');

    t.end();
});
