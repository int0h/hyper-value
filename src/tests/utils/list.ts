import test = require('tape');
import {List} from '../../utils/list';

test('list test', t => {
    const list = new List();
    t.is(list.entries().length, 0);
    const id = list.add('foo');
    t.is(list.get(id), 'foo');
    list.set(id, 'boo');
    t.is(list.get(id), 'boo');
    t.deepEqual(list.entries().map(([, value]) => value), ['boo']);
    list.del(id);
    t.is(list.entries().length, 0);
    t.end();
});
