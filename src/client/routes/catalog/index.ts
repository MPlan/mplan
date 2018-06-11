import * as Model from 'models';
import { Catalog, CatalogProps } from './catalog';

const scopeDefiner = (store: Model.App) => ({
  catalog: store.catalog,
  searchResults: store.catalogUi.searchResults,
});

const container = Model.store.connect(Catalog)({
  scopeDefiner,
  mapScopeToProps: ({ store, scope: _scope, sendUpdate, ownProps }) => {
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    return {
      searchResults: scope.searchResults,
      onSearch: query => sendUpdate(store => store.catalogUi.search(query).updateStore(store)),
    };
  },
});

export { container as Catalog };
