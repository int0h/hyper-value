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

test('object getProp', t => {
    const hs = new ObjectScope();
    const hv = new HyperValue({name: 'Jack', age: 23});

    t.is(hs.getProp(hv, 'name'), 'Jack');

    t.is(hs.getProp(hv, 'age'), 23);

    t.end();
});

test('object setProp', t => {
    const hs = new ObjectScope();
    const hv = new HyperValue({name: 'Jack', age: 23});

    hs.setProp(hv, 'name', 'Phill');
    t.is(hv.$.name, 'Phill');

    hs.setProp(hv, 'age', 34);
    t.is(hv.$.age, 34);

    t.end();
});

test('object (array) setProp', t => {
    const hs = new ObjectScope();
    const hv = new HyperValue([1, 2]);

    hs.setProp(hv, 1, 3);
    t.deepEqual(hv.$, [1, 3]);

    t.end();
});

