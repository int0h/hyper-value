// TODO:
// it does not work properly on node v8.9.0

// import test = require('tape');
// import {HyperValue, scopes} from '../..';
// import weak = require('weak');

// if (!/v6/.test(process.version)) {
//     process.exit();
// }

// declare function gc(): void;

// test('weak works', t => {
//     let obj: {a: number} | null = {a: 2};
//     const wr = weak(obj, () => {
//         t.end();
//     });

//     t.is(weak.isWeakRef(wr), true);

//     t.deepEqual(weak.get(wr), {a: 2});

//     obj = null;
//     gc();

//     t.is(weak.get(wr), undefined);

//     if (weak.isDead(wr)) {
//         const val = weak.get(wr);
//         t.is(val, undefined);
//     }
// });

// test('watchers are kept by source hv', t => {
//     const hs = new scopes.FullScope();
//     const hv = new HyperValue(0);
//     let func: any = () => {};
//     const wFunc = weak(func);
//     const watcherId = hs.watch(hv, func);
//     func = null;
//     gc();
//     t.is(weak.isDead(wFunc), false);

//     // unwatch fixes it
//     hs.unwatch(hv, watcherId);
//     gc();
//     t.is(weak.isDead(wFunc), true);
//     t.end();
// });

// test('scopes can be freed', t => {
//     const hs = new scopes.FullScope();
//     const hv = new HyperValue(0);
//     let func: any = () => {};
//     const wFunc = weak(func);
//     hs.watch(hv, func);

//     func = null;
//     gc();
//     t.is(weak.isDead(wFunc), false);

//     hs.free();
//     gc();
//     t.is(weak.isDead(wFunc), true);
//     t.end();
// });
