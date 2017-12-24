import test = require('tape');
import {HyperValue, scopes} from '../..';

test('--', t => {
    const gs = new scopes.FullScope();

    const keys = new HyperValue(3);

    let renderHs = new scopes.FullScope();

    gs.auto(() => {
        renderHs.free();
        renderHs = new scopes.FullScope();
        const a = renderHs.auto(() => keys.$ && 1);
        const b = renderHs.auto(() => keys.$ && 1);
        a.$;
    });

    keys.$ = 33;
});
