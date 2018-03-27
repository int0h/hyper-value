import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {concat} from './';

test('array concat', t => {
    const hs = new HyperScope();
    const a1 = new HyperValue([1, 2, 3]);
    const a2 = new HyperValue([4, 5, 6]);
    const joined = concat(hs, a1, a2);

    t.deepEqual(joined.$, [1, 2, 3, 4, 5, 6]);

    a1.$ = [1, 9, 3];
    t.deepEqual(joined.$, [1, 9, 3, 4, 5, 6]);

    a2.$ = [4, 9, 6];
    t.deepEqual(joined.$, [1, 9, 3, 4, 9, 6]);

    t.end();
});
