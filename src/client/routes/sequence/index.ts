import * as Model from 'models';
import { Sequence } from './sequence';

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (scope: Model.App) => {
    return {
      catalog: scope.catalog,
      degree: scope.user.degree,
    };
  },
  mapDispatchToProps: () => ({}),
})(Sequence);

export { container as Sequence };
