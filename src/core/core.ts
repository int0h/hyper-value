import {addToRecords} from './record';
import {globalDispatcher} from './dispatcher';
import { traceHv} from '../debug';

let currentId = 0;

//@hvDebug
export class HyperValue<T> {
    private value: T;
    private newValue: T;
    private updating = false;
    id = currentId++;

    constructor(initialValue: T) {
        this.value = initialValue;
    }

    g(silent?: boolean): T {
        if (!silent) {
            addToRecords(this);
        }
        if (this.updating) {
            return this.newValue;
        }
        return this.value;
    }

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

    get $() {
        return this.g();
    }

    set $(newValue: T) {
        this.s(newValue);
    }

}
