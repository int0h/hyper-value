export interface Mixin<C1, C2> {
    new (...args: any[]): C1 & C2;
}
export type Constructor<T = {}> = new (...args: any[]) => T;

function assignProps(dstObj: any, srcObj: any) {
    Object.getOwnPropertyNames(srcObj).forEach(name => {
        dstObj[name] = srcObj[name];
    });
}

function getPrototypeChain(baseProto: any) {
    let res: any[] = [];

    while (true) {
        const proto = Object.getPrototypeOf(baseProto);
        if (!proto || proto === Object.prototype) {
            break;
        }
        res.push(proto);
        baseProto = proto;
    }

    res.reverse();
    return res;
}

export function mix<BC, C>(baseClass: Constructor<BC>, mixClass: Constructor<C>) {
    function NewClass (...args: any[]) {
        baseClass.apply(this, args);
        mixClass.apply(this, args);
    }

    [baseClass, mixClass].forEach(baseCtor => {
        const protos = [baseCtor.prototype, ...getPrototypeChain(baseCtor.prototype)];
        protos.forEach(proto => assignProps(NewClass.prototype, proto));
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
