import test = require('tape');

import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';

import {watch} from '../watch';
import {catchError} from './';

test('can be catched', t => {
    const hs = new HyperScope();
    const hv = new HyperValue(0);
    watch(hs, hv, () => {
        throw new Error('bad');
    });
    catchError(hs, hv.id, error => {
        t.true(error instanceof Error);
        t.is(error.message, 'bad');
    });
    hv.$ = 1;
    t.end();
});


