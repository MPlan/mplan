import * as Model from 'models';
import * as Record from 'recordize/record';
import { Catalog, CatalogProps } from './catalog';

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (scope: Model.App) => {
    return {
      searchResults: [] as any[],
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
