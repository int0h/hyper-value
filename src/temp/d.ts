function id<T>(a: T) {
    return a;
}

const foo = id(3213 + 4);

function foo(a: typeof id) {
    return a(431);
}
