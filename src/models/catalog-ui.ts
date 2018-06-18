import * as Record from '../recordize';
import * as Immutable from 'immutable';
import { App } from './app';
import { pointer } from './pointer';

export class CatalogUi extends Record.define({
  searchResults: [],
}) {
  get root(): App {
    return pointer.store.current();
  }

  static updateStore(store: App, newThis: CatalogUi) {
    return store.set('catalogUi', newThis);
  }

  search(query: string) {
    console.log('todo');
    return this.set('searchResults', []);
  }
}
