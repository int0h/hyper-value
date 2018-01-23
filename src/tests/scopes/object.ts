import test = require('tape');
import {HyperValue} from '../..';
import {ObjectScope} from '../../scopes/object';

test('object prop', t => {
    const hs = new ObjectScope();
    const hv = new HyperValue({name: 'Jack', age: 23});
    const nameHv = hs.prop(hv, 'name');

    t.is(nameHv.$, 'Jack');

    hv.$ = {name: 'Emma', age: 27};
    t.is(nameHv.$, 'Emma', 'object -> prop binding');

    nameHv.$ = 'Mike';
    t.deepEqual(hv.$, {name: 'Mike', age: 27}, 'prop -> prop binding');
    t.end();
});

