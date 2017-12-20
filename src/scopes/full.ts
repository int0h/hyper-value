import {mixSome} from '../utils/mixin';
import {BaseScope} from './base';
import {AutoScope} from './auto';
import {AsyncScope} from './async';
import {CastScope} from './cast';
import {ProxyScope} from './proxy';

export const FullScope = mixSome(
    BaseScope,
    AutoScope,
    AsyncScope,
    CastScope,
    ProxyScope
) as any as FSClass;

export interface FSClass {
    new (...args: any[]): FSType;
}

export interface FSType extends BaseScope, AutoScope, AsyncScope, CastScope, ProxyScope {}
