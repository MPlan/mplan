import * as Model from 'models';
import * as Record from 'recordize/record';
import { Catalog, CatalogProps } from './catalog';

const scopeDefiner = (store: Model.App) => ({
  catalog: store.catalog,
  searchResults: store.catalogUi.searchResults,
});

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (scope: Model.App) => {
    return {
      searchResults: scope.catalogUi.searchResults,
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onSearch: (query: string) =>
        dispatch(store => {
          const nextCatalogUi = store.catalogUi.search(query);
          return Model.CatalogUi.updateStore(store, nextCatalogUi);
        }),
    };
  },
})(Catalog);

export { container as Catalog };
