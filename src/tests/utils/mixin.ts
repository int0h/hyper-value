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

test('prototype chain', t => {
    class A {
        foo() {
            return 1;
        }
    }

    class B extends A {
        boo() {
            return 2;
        }
    }

    class C {
        coo() {
            return 3;
        }
    }

    const Mixed = mix(B, C);

    const inst = new Mixed();
    t.is(inst.foo(), 1);
    t.is(inst.boo(), 2);
    t.is(inst.coo(), 3);
    t.end();
});
