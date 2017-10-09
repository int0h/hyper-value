import {hvAuto, hvMake} from '..';

const a = hvMake(1);

// const b = hvAuto(() => a.g());

hvAuto(() => {
    return a.g() + a.g();
});

a.watch(() => {
    const len = (a as any).watchers.length;
    console.log('a len:', len);
});

for (let i = 0; i < 5; i++) {
    a.s(i);
}

a.s(10);
console.log('done');
