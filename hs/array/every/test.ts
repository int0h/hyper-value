import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {every} from './';

test('array every', t => {
    const hs = new HyperScope();
    const hv = new HyperValue([1, 2, 3]);
    const everyIsEven = every(hs, hv, i => i % 2 === 0);

    t.false(everyIsEven.$);

    hv.$ = [4, 2, 6];
    t.true(everyIsEven.$);

    t.end();
});
