import {HyperValue} from '../../core/core';

/**
 * It takes either hyper-value of type T or a variable of T type and return the primitive value.
 * It can be useful if you are making a function that can accept both primitives and hyper-values.
 * In comparison to `cast` it always return T type of value.
 * @param value the value to be casted to hyper-value
 * @typeparam T type of the value
 * @see `cast`
 */
export function read<T>(value: HyperValue<T> | T): T {
    return value instanceof HyperValue
        ? value.g()
        : value;
}
