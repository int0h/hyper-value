import test = require('tape');

import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';

import {bind} from './';

test('basic bind', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    const hv2 = new HyperValue(0);
    bind(hs, hv, () => {
        return hv2.g() + 1;
    });

    hv2.s(2);
    t.is(hv.g(), 3);

    t.end();
});

