import { App } from './app';
import { createStore } from '../recordize';
import { pointer } from './pointer';

export const store = createStore(new App());

pointer.store = store;
