import * as Model from 'models';
import { Sequence, SequenceProps } from './sequence';

const scopeDefiner = (store: Model.App) => ({
  catalog: store.catalog,
  degree: store.user.degree,
});

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
