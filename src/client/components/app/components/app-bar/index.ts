import * as Model from 'models';
import { AppBar } from './app-bar';

const Container = Model.store.connect({
  mapStateToProps: state => ({
    username: '',
    saving: false,
  }),
  mapDispatchToProps: state => ({}),
})(AppBar);

export { Container as AppBar };
