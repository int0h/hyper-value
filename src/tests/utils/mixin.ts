import test = require('tape');
import {mix} from '../../utils/mixin';

test('list test', t => {
    class A {
        foo: number;
        constructor(a: number) {
            this.foo = a;
        }
    }

    class B {
        boo = 4;
    }

    const Mixed = mix(A, B);

    const inst = new Mixed(3);
    t.is(inst.boo, 4);
    t.is(inst.foo, 3);
    t.end();
});
