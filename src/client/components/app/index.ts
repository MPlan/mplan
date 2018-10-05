import * as Model from 'models';
import { App } from './app';
import { history } from 'client/history';

const Container = Model.store.connect({
  mapStateToProps: () => ({}),
  mapDispatchToProps: dispatch => ({
    onMount: async () => {
      (window as any).Intercom('boot', {
        app_id: 'zpvusrfo',
      });

      history.listen(() => {
        (window as any).Intercom('update');
      });
    },
  }),
})(App);

export { Container as App };
