import * as Record from '../recordize';
import * as Immutable from 'immutable';
import { App } from './app';
import { pointer } from './pointer';
import { DegreeGroup } from './degree-group';
import { SearchResults } from './catalog';
import { TypeIn } from 'utilities/typings';

export class DegreePage extends Record.define({
  searchResults: Immutable.Seq([]) as SearchResults,
  currentDegreeGroup: undefined as DegreeGroup | undefined,
}) {
  get root(): App {
    return pointer.store.current();
  }

  updateStore = (store: App) => {
    return store.set('degreePage', this);
  };

  search(query: string) {
    const searchResults = this.root.catalog.search(query);
    return this.set('searchResults', searchResults);
  }

  clearSearch() {
    return this.set('searchResults', Immutable.Seq([]));
  }

  setCurrentDegreeGroup(degreeGroup: DegreeGroup) {
    return this.set('currentDegreeGroup', degreeGroup);
  }
}
