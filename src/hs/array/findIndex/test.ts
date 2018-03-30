import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {findIndex} from './';

test('array findIndex', t => {
    const hs = new HyperScope();
    const hv = new HyperValue([1, 2, 3]);
    const found = findIndex(hs, hv, i => i ** 2 === 4);

    t.is(found.$, 1);

    hv.$ = [1, 3, 4];
    t.is(found.$, -1);

    t.end();
});
