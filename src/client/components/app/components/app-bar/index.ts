import * as Model from 'models';
import { AppBar } from './app-bar';
import { Auth } from 'client/auth';

const Container = Model.store.connect({
  mapStateToProps: state => ({
    username:
      process.env.NODE_ENV !== 'production' ? 'Local Test User' : Auth.userDisplayName() || '',
    saving: state.saveCount > 0,
  }),
  mapDispatchToProps: () => ({}),
})(AppBar);

export { Container as AppBar };
