import * as Model from 'models';
import { App } from './app';
import { fetchInitial } from 'client/fetch/fetch-initial';

const Container = Model.store.connect({
  mapStateToProps: () => ({}),
  mapDispatchToProps: dispatch => ({
    onMount: async () => {
      const { user, catalog } = await fetchInitial();

      dispatch(state => ({
        ...state,
        catalog,
        user,
        loaded: true,
      }));
    },
  }),
})(App);

export { Container as App };
