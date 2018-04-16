import * as Recordize from '../../recordize';
import * as Record from '../../models';
export * from '../../models';
import * as Immutable from 'immutable';
import * as Model from '../../models/models';
export const store = Recordize.createStore(new Record.App());
import { oneLine } from 'common-tags';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map, distinct, debounceTime, share } from 'rxjs/operators';
import { Auth } from '../auth';

const user$ = Observable.create((observer: Observer<Record.App>) => {
  store.subscribe(store => {
    observer.next(store);
  });
}).pipe(share(), map((store: Record.App) => store.user), distinct()) as Observable<Record.User>;

user$.pipe(debounceTime(300)).subscribe(user => {
  localStorage.setItem('user_data', JSON.stringify(user.toJS()));
});

user$.pipe(debounceTime(3000)).subscribe(async user => {
  console.log('sending to server...');
  await fetch(`/api/users/${user.username}`, {
    method: 'PUT',
    headers: new Headers({
      Authorization: `Bearer ${localStorage.getItem('idToken')}`,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(user.toJS()),
  });
  console.log('finished sending');
});

const masteredDegrees$ = Observable.create((observer: Observer<Record.App>) => {
  store.subscribe(store => {
    observer.next(store);
  });
}).pipe(share(), map((store: Record.App) => store.masteredDegrees), distinct()) as Observable<
  Immutable.Map<string, Record.MasteredDegree>
>;

masteredDegrees$.pipe(debounceTime(3000)).subscribe(async user => {
  console.log('sending degrees to server...');
  await fetch(`/api/degrees`, {
    method: 'PUT',
    headers: new Headers({
      Authorization: `Bearer ${localStorage.getItem('idToken')}`,
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify(user.toJS()),
  });
  console.log('finished sending degrees');
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

async function fetchUser() {
  const token = localStorage.getItem('idToken');
  const uniqueName = Auth.username();
  if (!uniqueName) {
    Auth.logout();
    Auth.login();
    return;
  }
  const response = await fetch(`/api/users/${uniqueName}`, {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });
  if (response.status !== 200) {
    console.log('returning empty user');
    return new Record.User().set('username', uniqueName);
  }
  const user = Record.User.fromJS(await response.json());
  return user;
}

async function fetchMasteredDegrees() {
  const token = localStorage.getItem('idToken');
  const response = await fetch('/api/degrees/', {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });
  const degreesJs = await response.json();
  const map = Object.entries(degreesJs).reduce((map, [key, value]) => {
    return map.set(key, Record.MasteredDegree.fromJS(value));
  }, Immutable.Map<string, Record.MasteredDegree>());
  return map;
}

const id0 = Record.ObjectId();
const id1 = Record.ObjectId();

async function load() {
  const [catalog, userFromServer, degrees] = await Promise.all([
    fetchCatalog(),
    fetchUser(),
    fetchMasteredDegrees(),
  ]);
  store.sendUpdate(store =>
    store
      .set('catalog', catalog)
      .set('user', userFromServer!)
      .set('masteredDegrees', degrees),
  );
}

load();
