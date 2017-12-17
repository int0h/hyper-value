import test = require('tape');
import {HyperValue} from '../..';
import {CastScope} from '../../scopes/cast';

test('basic cast', t => {
    const hs = new CastScope();
    const hv = new HyperValue(0);
    const n = 0;

    t.true(hs.cast(hv) instanceof HyperValue);
    t.true(hs.cast(n) instanceof HyperValue);
    t.end();
});

test('basic read', t => {
    const hs = new CastScope();
    const hv = new HyperValue(0);
    const n = 0;

    t.is(typeof hs.read(hv), 'number');
    t.is(typeof hs.read(n), 'number');
    t.end();
});
