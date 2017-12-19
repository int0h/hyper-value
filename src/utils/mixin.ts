export interface Mixin<C1, C2> {
    new (...args: any[]): C1 & C2;
}
export type Constructor<T = {}> = new (...args: any[]) => T;

export function mix<BC, C>(baseClass: Constructor<BC>, mixClass: Constructor<C>) {
    class NewClass {
        constructor(...args: any[]) {
            baseClass.apply(this, args);
            mixClass.apply(this, args);
        }
    }

    [baseClass, mixClass].forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            (NewClass.prototype as any) [name] = baseCtor.prototype[name];
        });
    });

    return NewClass as any as Mixin<BC, C>;
}

export function mixSome(...classes: Constructor<any>[]) {
    let result = classes[0];

    classes.slice(1).forEach(ctor => {
        result = mix(result, ctor);
    });

    return result;
}
