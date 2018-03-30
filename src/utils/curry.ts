import {HyperValue} from '../core/core';
import {BaseScope} from '../scopes/base';

export interface HvTransformerHelper<O, R, T> {
    (options: O): (hv: HyperValue<T>) => (hs: BaseScope) => R;
}

export interface HsHelper<O, R> {
    (options: O): (hs: BaseScope) => R;
}

export function curry<R>(fn: (hs: BaseScope) => R): () => (hs: BaseScope) => R; // 0
export function curry<A1, R>(fn: (hs: BaseScope, a1: A1) => R): (a1: A1) => (hs: BaseScope) => R; // 1
export function curry<A1, A2, R>(fn: (hs: BaseScope, a1: A1, a2: A2) => R): (a1: A1, a2: A2) => (hs: BaseScope) => R; // 2
export function curry<A1, A2, A3, R>(fn: (hs: BaseScope, a1: A1, a2: A2, a3: A3) => R): (a1: A1, a2: A2, a3: A3) => (hs: BaseScope) => R; // 3
export function curry<A1, A2, A3, A4, R>(fn: (hs: BaseScope, a1: A1, a2: A2, a3: A3, a4: A4) => R): (a1: A1, a2: A2, a3: A3, a4: A4) => (hs: BaseScope) => R; // 4
export function curry<A1, A2, A3, A4, A5, R>(fn: (hs: BaseScope, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => R): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5) => (hs: BaseScope) => R; // 5
export function curry<A1, A2, A3, A4, A5, A6, R>(fn: (hs: BaseScope, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => R): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6) => (hs: BaseScope) => R; // 6
export function curry<A1, A2, A3, A4, A5, A6, A7, R>(fn: (hs: BaseScope, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => R): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7) => (hs: BaseScope) => R; // 7
export function curry<A1, A2, A3, A4, A5, A6, A7, A8, R>(fn: (hs: BaseScope, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => R): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8) => (hs: BaseScope) => R; // 8
export function curry<A1, A2, A3, A4, A5, A6, A7, A8, A9, R>(fn: (hs: BaseScope, a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9) => R): (a1: A1, a2: A2, a3: A3, a4: A4, a5: A5, a6: A6, a7: A7, a8: A8, a9: A9) => (hs: BaseScope) => R; // 9
export function curry<R>(fn: (hs: BaseScope, ...args: any[]) => R): (...options: any[]) => (hs: BaseScope) => R {
    return (...options: any[]) => {
        return (hs: BaseScope) => {
            return fn(hs, ...options);
        };
    };
}

const hs  = new BaseScope;
const a = curry((hs: BaseScope, b: string, a: number) => 2);

/*
function genDeclarations(n) {
    const lines = [];
    for (let i = 1; i < n; i++) {
        const digits = [];
        for (let j = 1; j < i + 1; j++) {
            digits.push(j);
        }
        const argTypes = digits.map(d => 'A' + d).join(', ');
        const argDeclaration = digits.map(d => `a${d}: A${d}`).join(', ');
        lines.push(`export function curry<${argTypes}, R>(fn: (hs: BaseScope, ${argDeclaration}) => R): (${argDeclaration}) => (hs: BaseScope) => R; // ${i}`);
    }
    return lines.join('\n');
}
process.stdout.write(genDeclarations(10));
*/
