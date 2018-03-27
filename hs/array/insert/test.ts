import test = require('tape');

import {HyperValue} from '../../../core';

import {insert} from './';

test('array insert', t => {
    const arr = new HyperValue([1, 2, 3]);

    insert(arr, 0, 0);
    t.deepEqual(arr.$, [0, 1, 2, 3], 'insert in the beginning');

    insert(arr, Infinity, 4);
    t.deepEqual(arr.$, [0, 1, 2, 3, 4], 'insert in the end');

    insert(arr, -1, 3.5);
    t.deepEqual(arr.$, [0, 1, 2, 3, 3.5, 4], 'negative index');

    insert(arr, 0, [-2, -1]);
    t.deepEqual(arr.$, [-2, -1, 0, 1, 2, 3, 3.5, 4], 'insert a few');

    t.end();
});
