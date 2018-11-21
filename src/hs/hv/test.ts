import test = require('tape');

// import {HyperValue} from '../../core';
import {HyperScope} from '../../scopes';

import {hv} from './';

test('object prop', t => {
    const hs = new HyperScope();
    const state = hv(hs, {
        users: [
            {name: 'Jack', id: 0, age: 1}
        ],
        cfg: {
            serverCfg: {
                host: 'host',
                port: 8888
            }
        }
    });

    t.is(state.users.elem(0).name.$, 'Jack');

    const nameHv = state.users.elem(0).name;
    t.is(nameHv.$, 'Jack');

    state.users.elem(0)._.$ = {name: 'Emma', age: 27, id: 1};
    t.is(nameHv.$, 'Emma');

    t.deepEqual(state._.$, {
        users: [
            {name: 'Emma', age: 27, id: 1}
        ],
        cfg: {
            serverCfg: {
                host: 'host',
                port: 8888
            }
        }
    });
    t.end();
});
