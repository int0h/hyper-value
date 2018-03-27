import test = require('tape');

import {HyperValue} from '../../../core';
import {HyperScope} from '../../../scopes';

import {map} from './';

test('array map', t => {
    const hs = new HyperScope();
    const hv = new HyperValue([1, 2, 3]);
    const mapped = map(hs, hv, i => i * 2);

    t.deepEqual(mapped.$, [2, 4, 6]);

    hv.$ = [7, 8, 9];
    t.deepEqual(mapped.$, [14, 16, 18]);

    t.end();
});
