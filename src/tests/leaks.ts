import test = require('tape');
import {HyperValue, hvAuto} from '..';

test('watcher leaks', t => {
    const hv = new HyperValue(0);

    for (let i = 0; i < 1000; i++) {
        const notUsed = hvAuto(() => hv.g());
    }
    t.true(hv instanceof HyperValue);
    t.end();
});
