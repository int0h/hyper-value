import {mix, Mixin} from '../utils/mixin';
import {BaseScope} from './base';
import {AutoScope} from './auto';

export const FullScope: Mixin<BaseScope, AutoScope> = mix(BaseScope, AutoScope);
