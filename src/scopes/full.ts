import {mixSome, Constructor} from '../utils/mixin';
import {BaseScope} from './base';
import {AutoScope} from './auto';
import {AsyncScope} from './async';
import {CastScope} from './cast';

export const FullScope = mixSome(
    BaseScope,
    AutoScope,
    AsyncScope,
    CastScope
) as any as Constructor<BaseScope & AutoScope & AsyncScope & CastScope>;
