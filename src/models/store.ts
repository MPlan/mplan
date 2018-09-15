import * as App from './app';
import { createStore } from '../store';

const initialState: App.Model = {
  admins: [],
  catalog: {},
  masteredDegrees: {},
  prerequisiteOverrides: {},
  watchedMasteredDegrees: {},
  user: undefined,
  loaded: false,
  saveCount: 0,
};

export const store = createStore(initialState);
