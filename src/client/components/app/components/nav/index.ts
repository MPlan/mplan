import * as Model from 'models';
import { get } from 'utilities/get';
import { Nav } from './nav';
import { Routes, BottomRoutes } from 'client/routes';

const Container = Model.store.connect({
  mapStateToProps: state => ({
    isAdmin: !!get(state, _ => _.user.isAdmin),
    routes: Routes,
    bottomRoutes: BottomRoutes,
  }),
  mapDispatchToProps: () => ({}),
})(Nav);

export { Container as Nav };
