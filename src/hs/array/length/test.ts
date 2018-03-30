import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {length} from './';

test('array length', t => {
    const hs = new HyperScope();
    const hv = new HyperValue([1, 2, 3]);
    const len = length(hs, hv);

    t.is(len.$, 3);

    hv.$ = [1, 2, 3, 4];
    t.is(len.$, 4);

    t.end();
});
