import {mixSome} from '../utils/mixin';
import {BaseScope} from './base';
import {AutoScope} from './auto';
import {ArrayScope} from './array';
import {AsyncScope} from './async';
import {CastScope} from './cast';
import {ObjectScope} from './object';
import {ProxyScope} from './proxy';

export const FullScope = mixSome(
    BaseScope,
    AutoScope,
    ArrayScope,
    AsyncScope,
    CastScope,
    ObjectScope,
    ProxyScope
) as any as FSClass;

export interface FSClass {
    new (...args: any[]): FSType;
}

export interface FSType extends BaseScope, AutoScope, AsyncScope, CastScope, ProxyScope, ArrayScope, ObjectScope {}
