import test = require('tape');
import {HyperValue} from '../..';
import {AutoScope} from '../../scopes/auto';

test('basic bind', t => {
    const hs = new AutoScope();
    const hv = new HyperValue(0);
    const hv2 = new HyperValue(0);
    hs.bind(hv, () => {
        return hv2.g() + 1;
    });
    hv2.s(2);
    t.is(hv.g(), 3);
    t.end();
});

test('basic auto', t => {
    const hs = new AutoScope();
    const a = new HyperValue(5);
    const b = new HyperValue(5);
    const sum = hs.auto(() => a.$ + b.$);
    t.is(sum.$, 10);
    a.$ = 3;
    t.is(sum.$, 8);
    t.end();
});

test('auto multiple call', t => {
    const hs = new AutoScope();
    const a = new HyperValue(0);
    const exp = hs.auto(() => a.g());
    t.is(exp.g(), 0);
    a.s(1);
    t.is(exp.g(), 1);
    a.s(2);
    t.is(exp.g(), 2);
    a.s(3);
    t.is(exp.g(), 3);
    t.end();
});

test('auto multiple deps', t => {
    const hs = new AutoScope();
    const a = new HyperValue(1);
    const b = new HyperValue(2);
    const exp = hs.auto(() => a.g() || b.g());
    t.is(exp.g(), 1);
    a.s(0);
    t.is(exp.g(), 2);
    a.s(3);
    t.is(exp.g(), 3);
    t.end();
});

test('nested auto and get', t => {
    const hs = new AutoScope();
    const a = new HyperValue(0);
    const b = new HyperValue(0);
    const exp = hs.auto(() => hs.auto(() => a.$).$ + b.$);
    t.is(exp.g(), 0);
    a.s(1);
    t.is(exp.g(), 1);
    b.s(2);
    t.is(exp.g(), 3);
    t.end();
});

test('multi auto with the same dep', t => {
    const hs = new AutoScope();
    const v = new HyperValue(0);
    const a1 = hs.auto(() => v.g());
    const a2 = hs.auto(() => v.g());
    t.is(a1.g(), 0);
    t.is(a2.g(), 0);
    v.s(1);
    t.is(a1.g(), 1);
    t.is(a2.g(), 1);
    v.s(2);
    t.is(a1.g(), 2);
    t.is(a2.g(), 2);
    t.end();
});

// test('auto watchers limit same deps', t => {
//     const a = hvMake(0);

//     hvAuto(() => {
//         return a.g() + a.g();
//     });

//     a.watch(() => {
//         const len = (a as any).watchers.length;
//         if (len > 10) {
//             t.fail();
//         }
//     });

//     for (let i = 0; i < 10; i++) {
//         a.s(i);
//     }

//     t.pass();
//     t.end();
// });

// test('auto watchers limit different deps', t => {
//     const a = hvMake(0);
//     const b = hvMake(0);

//     hvAuto(() => {
//         return a.g() + b.g();
//     });

//     a.watch(() => {
//         const lenA = (a as any).watchers.length;
//         const lenB = (b as any).watchers.length;
//         if (lenA > 10 || lenB > 10) {
//             t.fail();
//         }
//     });

//     for (let i = 0; i < 5; i++) {
//         a.s(i);
//         b.s(i);
//     }

//     t.pass();
//     t.end();
// });
