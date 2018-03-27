import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {reduce} from './';

test('array reduce', t => {
    const hs = new HyperScope();
    const hv = new HyperValue([1, 2, 3]);
    const sum = reduce(hs, hv, (sum, i) => sum + i);

    t.is(sum.$, 6);

    hv.$ = [1, 2, 3, 4];
    t.is(sum.$, 10);

    const array = reduce(hs, hv, (acc: number[], i) => acc.concat(i), []);
    t.deepEqual(array.$, [1, 2, 3, 4]);

    t.end();
});
