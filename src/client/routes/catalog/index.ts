import * as Model from 'models';
import { Catalog, CatalogProps } from './catalog';

import withState from 'recompose/withState';
import compose from 'recompose/compose';

const Container = compose<CatalogProps, {}>(
  withState('search', 'setSearch', ''),
  Model.store.connect({
    mapStateToProps: (state, ownProps: any) => {
      const fullResults = Model.Catalog.getSearchResults(state.catalog, ownProps.search);

      return {
        ...ownProps,
        searchResults: fullResults.slice(0, 20),
        totalMatches: fullResults.length,
      };
    },
    mapDispatchToProps: (_, ownProps: any) => ({
      onSearch: ownProps.setSearch,
    }),
  }),
)(Catalog);

export { Container as Catalog };
