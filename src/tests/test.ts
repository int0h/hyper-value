import test = require('tape');
import {HyperValue, scopes} from '..';

test('basic', t => {
    const hs = new scopes.FullScope();
    const a = new HyperValue(1);
    const b = hs.auto(() => a.$ * 3);
    a.$ = 2;
    t.end();
});
