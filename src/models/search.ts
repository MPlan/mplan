import * as Record from '../recordize';
import * as Immutable from 'immutable';
import { App } from './app';
import { Course } from './course';
import { pointer } from './pointer';

export class Search extends Record.define({
  searchResults: [] as Course[],
  totalMatches: 0,
}) {
  get root(): App {
    return pointer.store.current();
  }

  static updateStore(store: App, newThis: Search) {
    return store.set('search', newThis);
  }

  search(query: string, take: number) {
    const results = this.root.catalog.search(query);
    const totalMatches = results.count();
    const searchResults = results.take(take).toArray();
    return this.set('searchResults', searchResults).set('totalMatches', totalMatches);
  }
}
