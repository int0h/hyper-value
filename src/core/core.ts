import {addToRecords} from './record';
import {globalDispatcher} from './dispatcher';

let currentId = 0;

export class HyperValue<T> {
    private value: T;
    private newValue: T;
    private updating = false;
    id = currentId++;
    debug: any;

    constructor(initialValue: T) {
        this.value = initialValue;
        this.debug = new Error('');
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

    s(newValue: T) {
        if (this.updating) {
            return;
        }

        this.updating = true;

        this.newValue = newValue;

        globalDispatcher.handle(this.id, this.value, newValue);

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
