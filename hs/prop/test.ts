import test = require('tape');

import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';

import {prop} from './';

test('object prop', t => {
    const hs = new HyperScope();
    const hv = new HyperValue({name: 'Jack', age: 23});
    const nameHv = prop(hs, hv, 'name');

    t.is(nameHv.$, 'Jack');

    hv.$ = {name: 'Emma', age: 27};
    t.is(nameHv.$, 'Emma', 'object -> prop binding');

    nameHv.$ = 'Mike';
    t.deepEqual(hv.$, {name: 'Mike', age: 27}, 'prop -> prop binding');
    t.end();
});
