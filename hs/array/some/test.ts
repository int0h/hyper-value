import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {some} from './';

test('array some', t => {
    const hs = new HyperScope();
    const hv = new HyperValue([1, 2, 3]);
    const hasEvens = some(hs, hv, i => i % 2 === 0);

    t.true(hasEvens.$);
    hv.$ = [1, 3];

    t.false(hasEvens.$);

    t.end();
});
