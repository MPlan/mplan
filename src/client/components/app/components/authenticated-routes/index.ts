import * as Model from 'models';
import { get } from 'utilities/get';

import { fetchInitial } from 'client/fetch/fetch-initial';
import { Routes, BottomRoutes } from 'client/routes';

import { AuthenticatedRoutes } from './authenticated-routes';

const Container = Model.store.connect({
  mapStateToProps: state => ({
    loaded: state.loaded,
    isAdmin: get(state, _ => _.user.isAdmin, false),
    routes: [...Routes, ...BottomRoutes],
  }),
  mapDispatchToProps: dispatch => ({
    onMount: async () => {
      const { user, catalog, masteredDegrees, prerequisiteOverrides } = await fetchInitial();

      dispatch(state => ({
        ...state,
        catalog,
        user,
        masteredDegrees,
        prerequisiteOverrides,
        loaded: true,
      }));
    },
  }),
})(AuthenticatedRoutes);

export { Container as AuthenticatedRoutes };
