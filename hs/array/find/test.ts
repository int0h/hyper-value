import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {find} from './';

test('array find', t => {
    const hs = new HyperScope();
    const hv = new HyperValue([1, 2, 3]);
    const found = find(hs, hv, i => i ** 2 === 4);

    t.is(found.$, 2);

    hv.$ = [1, 3, 4];
    t.is(found.$, null);

    t.end();
});
