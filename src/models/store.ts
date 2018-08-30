import { App } from './app';
import { createStore } from 'store';

const initialState: App = {
  admins: [],
  catalog: {},
  masteredDegrees: {},
  prerequisiteOverrides: {},
  user: {},
};

export const store = createStore(initialState);
