import * as Recordize from '../../recordize';
import * as Record from '../../models/records';
export * from '../../models/records';
import * as Immutable from 'immutable';
import * as Model from '../../models/models';
export const store = Recordize.createStore(new Record.App());
import { oneLine } from 'common-tags';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map, distinct, debounceTime, share } from 'rxjs/operators';

const store$ = Observable.create((observer: Observer<Record.App>) => {
  store.subscribe(store => {
    observer.next(store);
  });
}).pipe(share(), map((store: Record.App) => store.user), distinct()) as Observable<Record.User>;

store$.pipe(debounceTime(300)).subscribe(user => {
  localStorage.setItem('user_data', JSON.stringify(user.toJS()));
});

store$.pipe(debounceTime(3000)).subscribe(user => {
  console.log('sending to server...');
});

async function fetchCatalog() {
  const response = await fetch('/api/catalog', {
    headers: new Headers({
      Authorization: `Bearer ${localStorage.getItem('idToken')}`,
    }),
  });
  const courses = (await response.json()) as Model.Catalog;
  const courseMap = Object.entries(courses).reduce((catalogRecord, [courseId, course]) => {
    const { _id, sections: rawSections, ...restOfCourse } = course;

    const sections = Object.entries(rawSections).reduce((sections, [_season, sectionList]) => {
      const season = _season as 'Fall' | 'Winter' | 'Summer';
      const sectionSet = sectionList.reduce((sectionSet, rawSection) => {
        const section = new Record.Section({ ...rawSection });
        return sectionSet.add(section);
      }, Immutable.Set<Record.Section>());

      return sections.set(season, sectionSet);
    }, Immutable.Map<'Fall' | 'Winter' | 'Summer', Immutable.Set<Record.Section>>());

    const courseRecord = new Record.Course({
      ...restOfCourse,
      _id: Record.ObjectId(course._id),
      fallSections: sections.get('Fall') || Immutable.Set<Record.Section>(),
      winterSections: sections.get('Winter') || Immutable.Set<Record.Section>(),
      summerSections: sections.get('Summer') || Immutable.Set<Record.Section>(),
    });
    return catalogRecord.set(courseId, courseRecord);
  }, Immutable.Map<string, Record.Course>());

  const catalog = new Record.Catalog({ courseMap });
  return catalog;
}

async function load() {
  const catalog = await fetchCatalog();
  if (localStorage.getItem('user_data')) {
    const userDataJson = localStorage.getItem('user_data')!;
    const userFromStorage = Record.User.fromJS(JSON.parse(userDataJson));
    store.sendUpdate(store => store.set('catalog', catalog).set('user', userFromStorage));
  }
}

load();
