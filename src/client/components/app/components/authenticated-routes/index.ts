import * as Model from 'models';
import { AuthenticatedRoutes } from './authenticated-routes';
import { fetchUser } from 'client/fetch/user';
import { Auth } from 'client/auth';
import { get } from 'utilities/get';
import { Routes, BottomRoutes } from 'client/routes';

const Container = Model.store.connect({
  mapStateToProps: state => ({
    loaded: state.loaded,
    isAdmin: get(state, _ => _.user.isAdmin, false),
    routes: [...Routes, ...BottomRoutes],
  }),
  mapDispatchToProps: dispatch => ({}),
})(AuthenticatedRoutes);

export { Container as AuthenticatedRoutes };
