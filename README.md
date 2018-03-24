# Hyper-value

This is a library designed to help application data management.

At this point it is recommended to use with [hv-jsx](https://github.com/int0h/hv-jsx) and [hv-dom](https://github.com/int0h/hv-dom). You can find an introduction tutorial here: https://medium.com/@int0h/hyper-value-living-data-in-your-application-a54aab68d8b1

# Demos

[hv-counter-app](https://github.com/int0h/hv-counter-app) — simple counter application

[hv-todo-list](https://github.com/int0h/hv-todo-list) — todo-mvc like application

[hv-async-app](https://github.com/int0h/hv-async-app) — async demo

# Structure

This library consists of the **core** and **heplers**.

**core** - is a simple wrapper for any javascript value that allows to read / write the value inside. Also it provides a way to watch changes of this value and react to them.

**helpers** - are some utility functions designed to help with most common use cases. They may (and may not) take a hyper-value as an argument and they may (or may not) return new hyper-values. At this point all helpers are methods of specific *HyperScope* (it will be described below), but it will likely change in near future.

### Core

To create a hyper-value you can use a `HyperValue` constructor:

```js
import {HyperValue} from 'hyper-value';
const myHyperValue = new HyperValue(myValue);
```

hyper-value can be watched like this:

```js
// hs - is hyper-scope
hs.watch(myHyperValue, (newValue, oldValue) => {
	console.log(`
		current value has just been set to: ${newValue};
		old value was: ${oldValue};
	`);
})
```

### hyper-scope

Hyper-scope is a utility entity who owns hyper-value watchers, it can be created manually but it usually should be created for you by a library or framework.

# API Specification

### Class HyperValue:
Creating an instance:

```js
const hv = new HyperValue(1);
```

The constructor takes only one argument which is the initial value of HyperValue to be created.

Each HyperValue has these fields:

- `$` property - is an interface to inner value. It's recommended way to read and write;
- `g` method - allows to **get** the value inside. It's not fully stable (it's likely to be renamed to `get`), use `$` when it's possible. It also takes an optional argument `silent`, which can be used to avoid *recording* its owner from adding to dependencies inside **auto** scope and similar ones;
-  `s` method - allows to set the value inside. It's not fully stable (it's likely to be renamed to `set`), use `$` when it's possible. It takes only one argument which is the new value;

## Helpers

### Watch helpers

- `watch` - simple calls passed function on each change of hyper-value; returns `WatcherId` - entity needed to unsubscribe from hyper-value changes;
- `unwatch` - removes watcher from hyper-value;

### Auto helpers

`auto` - helper takes a function which calculates some value out of some hyper-values and return a new hyper-value equals to calculated expression. Furthermore it remembers all hyper-values used in the function and subscribe to them. Because of that, the returned hyper-value is always relevant.

For example:
```js
const a = new HyperValue(2);
const b = new HyperValue(2);
const sum = auto(() => a.$ * b.$);

console.log(sum.$); // 4

a.$ = 3;
console.log(sum.$); // 6
```

`bind` - is basically the same as `auto` but it takes an **existing** hyper-value and **updates** its value in the same way;

### Array helpers

Helpers of this group make work with arrays slightly easier. Most of them operate hyper-value of any array (e. g. `const hyperArray = new HyperValue([1, 2, 3])`).

#### non-mutable helpers:
- `length` - creates a new hyper-value of number which is always equal to the length of passed *hyper-array*;
- `map`, `filter`, `every`, `some`, `reduce`, `find`, `findIndex` - are basically the same as Array.* methods but instead of plain value they return hyper-value always synchronized with source array;
- `concat` - similar `Array.concat`. It takes 1..∞ hyper-arrays and return a new one which is always equal to concat'ed source one;
- `slice` - takes 2 or 3 arguments.
	- 1st - is *hyper-array* to be sliced;
	- 2nd - start of a slice (it can be either number or hyper-value of number);
	- 3nd - [optional] is the end of slice (it can be either number or hyper-value of number);
- `sort` - takes a hyper-array and sorting function (same as `Array.sort`). In contrast to `Array.sort` it **does not mutate** the original hyper-array, **it returns a new one**.

#### mutable helpers:

- `insert` - it takes a *hyper-array* to be changed, `id` which must be number (hyper-value of number cannot be passed) and one or array of new elements to insert;
- `remove` - it takes a *hyper-array* to be changed, `id` which must be number (hyper-value of number cannot be passed) and number of elements to be deleted.

> **Note**: both `insert` and `remove` treat Infinity as end of array. So if you need to add something in the end you can write: `insert(array, Infinity, newItem)`. They also handle negative numbers similarly to `Array.slice`.

### Other helpers

The documentation for other helpers is being made and will be updated soon.
