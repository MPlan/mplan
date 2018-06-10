import * as Model from 'models';
import { Sequence, SequenceProps } from './sequence';

const scopeDefiner = (store: Model.App) => ({
  catalog: store.catalog,
  degree: store.user.degree,
});

const container = Model.store.connect(Sequence)({
  scopeDefiner,
  mapScopeToProps: ({ store, scope: _scope, sendUpdate, ownProps }) => {
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    const catalogUi = store.catalogUi;
    return {
      catalog: scope.catalog,
      degree: scope.degree,
    };
  },
});

export { container as Sequence };
