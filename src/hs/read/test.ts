import test = require('tape');

import {HyperValue} from '../../core';

import {read} from './';

test('basic read', t => {
    const hv = new HyperValue(0);
    const n = 0;

    t.is(typeof read(hv), 'number');
    t.is(typeof read(n), 'number');
    t.end();
});
