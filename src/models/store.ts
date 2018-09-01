import { App } from './app';
import { createStore } from '../store';

const initialState: App = {
  admins: [],
  catalog: {},
  masteredDegrees: {},
  prerequisiteOverrides: {},
  user: undefined,
};

export const store = createStore(initialState);
