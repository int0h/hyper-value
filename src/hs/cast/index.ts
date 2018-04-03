import {HyperValue} from '../../core/core';

/**
 * It takes either hyper-value of type T or a variable of T type and cast it to hyper-value.
 * It can be useful if you are making a function that can accept both primitives and hyper-values.
 * In comparison to `read` it always return hyper-value.
 * @param value the value to be casted to hyper-value
 * @typeparam T the type of value
 * @see `read`
 */
export function cast<T>(value: HyperValue<T> | T): HyperValue<T> {
    return value instanceof HyperValue
        ? value
        : new HyperValue(value);
}
