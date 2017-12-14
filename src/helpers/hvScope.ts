import {HyperValue} from '../core';
import {hvAuto, hvWrap} from './tools';

export class HvScope {
    private hvList: HyperValue<any>[] = [];
    childScopes: HvScope[] = [];

    constructor(parent?: HvScope) {
        if (parent) {
            parent.childScopes.push(this);
        }
    }

    addHv<T>(hv: HyperValue<T>): HyperValue<T> {
        this.hvList.push(hv);
        return hv;
    }

    hv<T>(initial: T): HyperValue<T> {
        return this.addHv(new HyperValue(initial));
    }

    hvAuto<T>(fn: () => T): HyperValue<T> {
        return this.addHv(hvAuto(fn));
    }

    hvWrap<I, O>(hv: HyperValue<I>, fn: (value: I) => O): HyperValue<O> {
        return this.addHv(hvWrap(hv, fn));
    }

    free() {
        for (const hv of this.hvList) {
            hv.free();
        }

        this.hvList = [];

        for (const scope of this.childScopes) {
            scope.free();
        }
    }

}
