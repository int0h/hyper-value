import test = require('tape');
import {globalDispatcher} from '../../core/dispatcher';
import {HyperValue} from '../..';

test('still globally throws', t => {
    const hv = new HyperValue(0);
    globalDispatcher.watch(hv.id, () => {
        throw new Error('bad');
    });
    t.throws(() => {
        hv.$ = 1;
    });
    t.end();
});

test('can be catched', t => {
    const hv = new HyperValue(0);
    globalDispatcher.watch(hv.id, () => {
        throw new Error('bad');
    });
    globalDispatcher.catch(hv.id, error => {
        t.true(error instanceof Error);
        t.is(error.message, 'bad');
    });
    hv.$ = 1;
    t.end();
});
