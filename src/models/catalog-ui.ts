import * as Record from 'recordize';
import * as Immutable from 'immutable';
import { SearchResults } from './catalog';
import { App } from './app';
import { pointer } from './pointer';

const searchResults: SearchResults = {
  count: 0,
  results: Immutable.Seq.Indexed(),
};

export class CatalogUi extends Record.define({
  searchResults,
}) {
  get root(): App {
    return pointer.store.current();
  }

  updateStore() {
    return (store: App) => store.set('catalogUi', this);
  }

  search(query: string) {
    const searchResults = this.root.catalog.search(query);
    return this.set('searchResults', searchResults);
  }
}
