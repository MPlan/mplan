import * as Record from '../recordize';
import * as Immutable from 'immutable';
import { App } from './app';
import { pointer } from './pointer';
import { DegreeGroup } from './degree-group';

export class DegreePage extends Record.define({
  searchResults: [],
  currentDegreeGroup: undefined as DegreeGroup | undefined,
}) {
  get root(): App {
    return pointer.store.current();
  }

  static updateStore(store: App, newThis: DegreePage) {
    return store.set('degreePage', newThis);
  }

  search(query: string) {
    const searchResults = this.root.catalog.search(query);
    return this.set('searchResults', []);
  }

  clearSearch() {
    return this.set('searchResults', []);
  }

  setCurrentDegreeGroup(degreeGroup: DegreeGroup) {
    return this.set('currentDegreeGroup', degreeGroup);
  }
}
