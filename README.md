# Hyper-value

[![Build Status](https://api.travis-ci.org/int0h/hyper-value.svg?branch=master)](https://travis-ci.org/int0h/hyper-value)
[![Coverage Status](https://coveralls.io/repos/github/int0h/hyper-value/badge.svg?branch=master)](https://coveralls.io/github/int0h/hyper-value?branch=master)

This is a library designed to help application data management.

At this point it is recommended to use with [hv-jsx](https://github.com/int0h/hv-jsx) and [hv-dom](https://github.com/int0h/hv-dom). You can find an introduction tutorial here: https://medium.com/@int0h/hyper-value-living-data-in-your-application-a54aab68d8b1

Docs: https://int0h.github.io/hyper-value

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

Documentation about helpers can be found here:
- [async helper](https://int0h.github.io/hyper-value/modules/_hs_async_index_.html)
- [auto helper](https://int0h.github.io/hyper-value/modules/_hs_auto_index_.html)
- [bind helper](https://int0h.github.io/hyper-value/modules/_hs_bind_index_.html)
- [cast helper](https://int0h.github.io/hyper-value/modules/_hs_cast_index_.html)
- [catch helper](https://int0h.github.io/hyper-value/modules/_hs_catch_index_.html)
- [prop helper](https://int0h.github.io/hyper-value/modules/_hs_prop_index_.html)
- [proxy helper](https://int0h.github.io/hyper-value/modules/_hs_proxy_index_.html)
- [read helper](https://int0h.github.io/hyper-value/modules/_hs_read_index_.html)
- [unwatch helper](https://int0h.github.io/hyper-value/modules/_hs_unwatch_index_.html)
- [wait helper](https://int0h.github.io/hyper-value/modules/_hs_wait_index_.html)
- [watch helper](https://int0h.github.io/hyper-value/modules/_hs_watch_index_.html)
- array helpers:
	- [concat helper](https://int0h.github.io/hyper-value/modules/_hs_array_concat_index_.html)
	- [every helper](https://int0h.github.io/hyper-value/modules/_hs_array_every_index_.html)
	- [filter helper](https://int0h.github.io/hyper-value/modules/_hs_array_filter_index_.html)
	- [find helper](https://int0h.github.io/hyper-value/modules/_hs_array_find_index_.html)
	- [findIndex helper](https://int0h.github.io/hyper-value/modules/_hs_array_findindex_index_.html)
	- [insert helper](https://int0h.github.io/hyper-value/modules/_hs_array_insert_index_.html)
	- [length helper](https://int0h.github.io/hyper-value/modules/_hs_array_length_index_.html)
	- [map helper](https://int0h.github.io/hyper-value/modules/_hs_array_map_index_.html)
	- [reduce helper](https://int0h.github.io/hyper-value/modules/_hs_array_reduce_index_.html)
	- [remove helper](https://int0h.github.io/hyper-value/modules/_hs_array_remove_index_.html)
	- [slice helper](https://int0h.github.io/hyper-value/modules/_hs_array_slice_index_.html)
	- [some helper](https://int0h.github.io/hyper-value/modules/_hs_array_some_index_.html)
	- [sort helper](https://int0h.github.io/hyper-value/modules/_hs_array_sort_index_.html)
