import * as App from './app';
import { createStore } from '../store';

const initialState: App.Model = {
  admins: [],
  catalog: {},
  masteredDegrees: {},
  prerequisiteOverrides: {},
  user: undefined,
  loaded: false,
};

export const store = createStore(initialState);
