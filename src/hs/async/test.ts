// import test = require('tape');

// import {HyperValue} from '../../core';
// import {HyperScope} from '../../scopes';

// import {wait as waitFor} from '../wait';

// import {async} from './';

// function wait(ms: number): Promise<void> {
//     return new Promise(resolve => {
//         setTimeout(() => resolve(), ms);
//     });
// }

// async function returnDelayed<T>(value: T, ms: number): Promise<T> {
//     await wait(ms);
//     return value;
// }

// async function throwDelayed(msg: string, ms: number): Promise<void> {
//     await wait(ms);
//     throw new Error(msg);
// }

// test('hvAsync basic', async t => {
//     const hs = new HyperScope();
//     const a = new HyperValue(0);
//     const [b] = async(hs, {get: async w => {
//         return await w(returnDelayed(a.g() * 2, 50));
//     }});
//     const resolved = await waitFor(hs, b);

//     t.is(resolved.g(), 0);
//     a.s(2);
//     t.is(resolved.g(), 0);
//     await wait(75);
//     t.is(resolved.g(), 4);
//     t.end();
// });

// test('hvAsync ignore parallel writting', async t => {
//     const hs = new HyperScope();
//     let callCount = 0;
//     const a = new HyperValue(0);
//     const b = new HyperValue(0);

//     setTimeout(() => b.s(1), 10);

//     const [c] = await async(hs, {get: async w => {
//         callCount++;
//         return await w(returnDelayed(a.g() * 2, 50));
//     }});
//     const resolved = await waitFor(hs, c);

//     t.is(b.g(), 1);
//     t.is(resolved.g(), 0);
//     a.s(2);
//     t.is(resolved.g(), 0);
//     await wait(75);
//     t.is(resolved.g(), 4);
//     t.is(callCount, 2);
//     t.end();
// });

// test('hvAsync multi hv capturing', async t => {
//     const hs = new HyperScope();
//     const a = new HyperValue(0);
//     const b = new HyperValue(0);

//     const [c] = await async(hs, {get: async w => {
//         const argA = a.g() * 2;
//         await w(returnDelayed(argA, 100));
//         const argB = argA + b.g() * 2;
//         return await w(returnDelayed(argB, 100));
//     }});
//     const resolved = await waitFor(hs, c);

//     t.is(resolved.g(), 0);
//     a.s(2);
//     t.is(resolved.g(), 0);
//     await wait(150);
//     t.is(resolved.g(), 0, 'not updated untill resolve');
//     await wait(100);
//     t.is(resolved.g(), 4, 'first update from a.s(2)');

//     b.s(3);
//     t.is(resolved.g(), 4);
//     await wait(250);
//     t.is(resolved.g(), 10);
//     t.end();
// });

// test('hvAsync sync', async t => {
//     const hs = new HyperScope();
//     const [a] = async(hs, {get: async w => {
//         return await w(returnDelayed(3, 100));
//     }});

//     t.is(a.g(), undefined);
//     await wait(150);
//     t.is(a.g(), 3);
//     t.end();
// });

// test('hvAsync sync: init value', async t => {
//     const hs = new HyperScope();
//     const [a] = async(hs, {initial: 1, get: async w => {
//         return await w(returnDelayed(3, 100));
//     }});

//     t.is(a.g(), 1);
//     await wait(150);
//     t.is(a.g(), 3);
//     t.end();
// });

// test('hvAsync: proper order of values', async t => {
//     let calledTimes = 0;
//     const hs = new HyperScope();
//     const a = new HyperValue(5);

//     const [b] = async(hs, {get: async w => {
//         return calledTimes++ < 1
//             ? await w(returnDelayed(a.$ * 1, 100))
//             : await w(returnDelayed(a.$ * 2, 10));
//     }});

//     a.$ = 10;
//     t.is(b.g(), undefined);
//     await wait(20);
//     t.is(b.$, 20);
//     await wait(150);
//     t.is(b.$, 20);
//     t.end();
// });

// test('hvAsync: proper order of values #2', async t => {
//     const hs = new HyperScope();
//     const a = new HyperValue(5);

//     const [b] = async(hs, {get: async w => {
//         return w(returnDelayed(a.$ * 2, 10));
//     }});

//     a.$ = 10;
//     a.$ = 20;
//     a.$ = 30;
//     t.is(b.g(), undefined);
//     await wait(20);
//     t.is(b.$, 60);
//     t.end();
// });

// test('hvAsync: state', async t => {
//     const hs = new HyperScope();

//     const [a, state] = async(hs, {get: async w => {
//         return await w(returnDelayed(1, 10));
//     }});

//     t.is(a.g(), undefined);
//     t.is(state.$, 'pending');
//     await wait(20);
//     t.is(a.g(), 1);
//     t.is(state.$, 'resolved');
//     t.end();
// });

// test('hvAsync: throw', async t => {
//     const hs = new HyperScope();

//     const [a, state] = async(hs, {get: async w => {
//         return await w(throwDelayed('err', 10));
//     }});

//     t.is(a.g(), undefined);
//     t.is(state.$, 'pending');
//     await wait(20);
//     t.is(a.g(), undefined);
//     t.is(state.$, 'rejected');
//     t.end();
// });

// // test('hvAsync: throw catch (async-await style)', async t => {
// //     t.plan(2);

// //     const hs = new HyperScope();

// //     const a = async(hs, {get: async w => {
// //         return await w(throwDelayed('err', 10));
// //     }});

// //     try {
// //         await a.wait();
// //     } catch (err) {
// //         t.is(err.message, 'err');
// //         t.pass();
// //     }
// // });

// // test('hvAsync: throw catch (promise style)', async t => {
// //     t.plan(2);

// //     const hs = new HyperScope();

// //     const [a] = async(hs, {get: async w => {
// //         return await w(throwDelayed('err', 10));
// //     }});

// //     a.wait().catch(err => {
// //         t.is(err.message, 'err');
// //         t.pass();
// //     });
// // });

// test('hvAsync: hv catch', async t => {
//     t.plan(2);

//     const hs = new HyperScope();

//     const [a] = async(hs, {get: async w => {
//         return await w(throwDelayed('err', 10));
//     }});

//     hs.catch(a, error => {
//         t.is(error.message, 'err');
//         t.pass();
//     });

//     await wait(20);
// });

// test('hvAsync: getter is optional', async t => {
//     const hs = new HyperScope();

//     const [a] = async(hs, {initial: 1});

//     t.is(a.$, 1);
//     a.$ = 2;
//     t.is(a.$, 2);
//     t.end();
// });

// test.skip('hvAsync: update basics', async t => {
//     const hs = new HyperScope();

//     const [a, state] = async(hs, {update: async () => returnDelayed(42, 10)});

//     t.is(a.$, undefined);
//     t.is(state.$, 'resolved');
//     await wait(20);
//     t.is(a.$, undefined);
//     a.$ = 2;
//     t.is(state.$, 'pending');
//     t.is(a.$, undefined);
//     await wait(20);
//     t.is(state.$, 'resolved');
//     t.is(a.$, 42);
//     t.end();
// });

// test.skip('hvAsync: setter basics', async t => {
//     const hs = new HyperScope();

//     const [a, state] = async(hs, {set: async () => wait(10)});

//     t.is(a.$, undefined);
//     t.is(state.$, 'resolved');
//     await wait(20);
//     t.is(a.$, undefined);
//     a.$ = 2;
//     t.is(state.$, 'pending');
//     t.is(a.$, undefined);
//     await wait(20);
//     t.is(state.$, 'resolved');
//     t.is(a.$, 2);
//     t.end();
// });

// test('hvAsync: set and update are not be set together', async t => {
//     const hs = new HyperScope();

//     t.throws(() => {
//         async(hs, {set: async () => wait(10), update: async () => wait(10)});
//     });

//     t.end();
// });

