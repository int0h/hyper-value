import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {slice} from './';

test('array slice', t => {
    const hs = new HyperScope();
    const arr = new HyperValue([1, 2, 3, 4, 5]);
    const s = new HyperValue(1);
    const e = new HyperValue(3);
    const sliced = slice(hs, arr, s, e);

    t.deepEqual(sliced.$, [2, 3]);

    s.$ = 2;
    t.deepEqual(sliced.$, [3]);

    e.$ = 5;
    t.deepEqual(sliced.$, [3, 4, 5]);

    const slicedFromStart = slice(hs, arr, s);
    t.deepEqual(slicedFromStart.$, [3, 4, 5]);

    const cloned = slice(hs, arr);
    t.deepEqual(cloned.$, [1, 2, 3, 4, 5]);

    t.end();
});
