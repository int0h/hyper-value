import {addToRecords} from './record';
import {globalDispatcher} from './dispatcher';
import {traceHv} from '../debug';

let currentId = 0;

/**
 * This is a main class of the library.
 * You can create hyper-values using constructor:
 * `const a = new HyperValue(1)`.
 *
 * After that you'll be able to read and write internal value and apply
 * helpers from hyper-value/hs;
 * @class HyperValue
 * @typeparam T type of internal value;
 * it can be omitted if it's possible to infer the type from constructor
 */
// @hvDebug
export class HyperValue<T> {
    private value: T;
    private newValue: T;
    private updating = false;
    id = currentId++;

    /**
     * creates a new HyperValue instance
     * @param initialValue the initial value of hyper-value, cannot be omitted
     */
    constructor(initialValue: T) {
        this.value = initialValue;
    }

    /**
     * reads the value of hyper-value
     * @param silent if set to true it will not trigger recording as dependency;
     * it could be used inside `auto` helper function and similar ones
     */
    g(silent?: boolean): T {
        if (!silent) {
            addToRecords(this);
        }
        if (this.updating) {
            return this.newValue;
        }
        return this.value;
    }

    /**
     * sets new value of hyper-value
     * (if the value is the same according to === nothing will happen)
     * @param newValue the new value
     */
    @traceHv
    s(newValue: T) {
        if (this.updating) {
            return;
        }

        if (newValue === this.value) {
            return;
        }

        this.updating = true;

        this.newValue = newValue;

        globalDispatcher.handle(this.id, newValue, this.value);

        this.value = newValue;

        this.updating = false;
    }

    /**
     * reading and writing `$` is recommended way to read and write the value of hyper-value
     */
    get $() {
        return this.g();
    }

    set $(newValue: T) {
        this.s(newValue);
    }

}
