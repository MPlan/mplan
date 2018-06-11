import * as Record from '../recordize';
import * as Immutable from 'immutable';
import { App } from './app';
import { pointer } from './pointer';
import { TypeIn } from 'utilities/typings';
import { SearchResults } from './catalog';

export class CatalogUi extends Record.define({
  searchResults: Immutable.Seq([]) as SearchResults,
}) {
  get root(): App {
    return pointer.store.current();
  }

  updateStore = (store: App) => {
    return store.set('catalogUi', this);
  };

  search(query: string) {
    const searchResults = this.root.catalog.search(query);
    return this.set('searchResults', searchResults);
  }
}
