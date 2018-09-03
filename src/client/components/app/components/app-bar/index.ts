import * as Model from 'models';
import { AppBar } from './app-bar';
import { get } from 'utilities/get';

const Container = Model.store.connect({
  mapStateToProps: state => ({
    username:
      process.env.NODE_ENV !== 'production'
        ? 'Local Test User'
        : get(state, _ => _.user.username, ''),
    saving: state.saveCount > 0,
  }),
  mapDispatchToProps: state => ({}),
})(AppBar);

export { Container as AppBar };
