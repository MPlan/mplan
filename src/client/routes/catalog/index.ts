import * as Model from 'models';
import * as Record from 'recordize/record';
import { Catalog, CatalogProps } from './catalog';
import { RouteComponentProps } from 'react-router';

const container = Model.store.connect({
  scopeTo: store => store.search,
  mapStateToProps: (search: Model.Search, ownProps: RouteComponentProps<any>) => {
    return {
      ...ownProps,
      searchResults: search.searchResults,
      totalMatches: search.totalMatches,
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onSearch: (query: string) => {
        dispatch(store => {
          const next = store.search.search(query, 50);
          return Model.Search.updateStore(store, next);
        });
      },
    };
  },
})(Catalog);

export { container as Catalog };
