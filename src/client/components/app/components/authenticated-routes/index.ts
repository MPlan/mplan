import * as Model from 'models';
import { AuthenticatedRoutes } from './authenticated-routes';

const Container = Model.store.connect({
  mapStateToProps: state => ({
    loaded: state.loaded,
  }),
  mapDispatchToProps: () => ({}),
})(AuthenticatedRoutes);

export { Container as AuthenticatedRoutes };
