import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {filter} from './';

test('array filter', t => {
    const hs = new HyperScope();
    const hv = new HyperValue([1, 2, 3]);
    const filtered = filter(hs, hv, i => i % 2 === 0);

    t.deepEqual(filtered.$, [2]);

    hv.$ = [1, 2, 3, 4];
    t.deepEqual(filtered.$, [2, 4]);

    t.end();
});
