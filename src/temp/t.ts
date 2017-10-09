import {hvAuto, hvMake} from '..';

const a = hvMake(0);
const b = hvMake(0);

hvAuto(() => {
    return a.g() + b.g();
});

a.watch(() => {
    const len = (a as any).watchers.length;
    const lenb = (b as any).watchers.length;
    console.log(len, lenb);
});

for (let i = 0; i < 5; i++) {
    a.s(i);
    b.s(i);
}


console.log('done');
