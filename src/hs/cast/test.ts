import test = require('tape');

import {HyperValue} from '../../core';

import {cast} from './';

test('basic cast', t => {
    const hv = new HyperValue(0);
    const n = 0;

    t.true(cast(hv) instanceof HyperValue);
    t.true(cast(n) instanceof HyperValue);
    t.end();
});

