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
import { decode } from 'base-64';

const store$ = Observable.create((observer: Observer<Record.App>) => {
  store.subscribe(store => {
    observer.next(store);
  });
}).pipe(share(), map((store: Record.App) => store.user), distinct()) as Observable<Record.User>;

store$.pipe(debounceTime(300)).subscribe(user => {
  localStorage.setItem('user_data', JSON.stringify(user.toJS()));
});

store$.pipe(debounceTime(3000)).subscribe(async user => {
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
  if (!token) throw new Error('not logged in');
  const payloadMatch = /[^.]*\.([^.]*)\.[^.]*/.exec(token);
  if (!payloadMatch) throw new Error('could not find payload in JWT');
  const payloadEncoded = payloadMatch[1];
  const decoded = decode(payloadEncoded);
  const payload = JSON.parse(decoded);
  const uniqueName = payload.nickname;
  if (!uniqueName) throw new Error('could not find unique name in JWT');
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

const id0 = Record.ObjectId();
const id1 = Record.ObjectId();

async function load() {
  const catalog = await fetchCatalog();
  // if (localStorage.getItem('user_data')) {
  //   const userDataJson = localStorage.getItem('user_data')!;
  //   const userFromStorage = Record.User.fromJS(JSON.parse(userDataJson));
  //   store.sendUpdate(store => store.set('catalog', catalog).set('user', userFromStorage));
  // }
  const userFromServer = await fetchUser();
  store.sendUpdate(store =>
    store
      .set('catalog', catalog)
      .set('user', userFromServer)
      .set(
        'masteredDegrees',
        Immutable.Map<string, Record.MasteredDegree>()
          .set(
            id0.toHexString(),
            new Record.MasteredDegree({
              _id: id0,
              name: 'Software Engineering F08',
              descriptionHtml: 'test',
            })
              .addGroup(
                new Record.MasteredDegreeGroup({
                  _id: Record.ObjectId(),
                  name: 'Written and oral comm',
                  creditMinimum: 6,
                  creditMaximum: 6,
                  blacklistedIds: Immutable.List<string>(),
                })
                  .addToWhitelist(catalog.getCourse('COMP', '105')!)
                  .addToWhitelist(catalog.getCourse('COMP', '106')!)
                  .addToWhitelist(catalog.getCourse('COMP', '270')!)
                  .addToDefaults(catalog.getCourse('COMP', '105')!)
                  .addToDefaults(catalog.getCourse('COMP', '270')!),
              )
              .addGroup(
                new Record.MasteredDegreeGroup({
                  _id: Record.ObjectId(),
                  name: 'Written and oral comm',
                  creditMinimum: 6,
                  creditMaximum: 6,
                  blacklistedIds: Immutable.List<string>(),
                })
                  .addToWhitelist(catalog.getCourse('COMP', '105')!)
                  .addToWhitelist(catalog.getCourse('COMP', '106')!)
                  .addToWhitelist(catalog.getCourse('COMP', '270')!)
                  .addToDefaults(catalog.getCourse('COMP', '105')!)
                  .addToDefaults(catalog.getCourse('COMP', '270')!),
              ),
          )
          .set(
            id1.toHexString(),
            new Record.MasteredDegree({
              _id: id1,
              name: 'Software Engineering F15',
              descriptionHtml: 'test',
            })
              .addGroup(
                new Record.MasteredDegreeGroup({
                  _id: Record.ObjectId(),
                  name: 'Written and oral comm',
                  creditMinimum: 6,
                  creditMaximum: 6,
                  blacklistedIds: Immutable.List<string>(),
                })
                  .addToWhitelist(catalog.getCourse('COMP', '105')!)
                  .addToWhitelist(catalog.getCourse('COMP', '106')!)
                  .addToWhitelist(catalog.getCourse('COMP', '270')!)
                  .addToDefaults(catalog.getCourse('COMP', '105')!)
                  .addToDefaults(catalog.getCourse('COMP', '270')!),
              )
              .addGroup(
                new Record.MasteredDegreeGroup({
                  _id: Record.ObjectId(),
                  name: 'Written and oral comm',
                  creditMinimum: 6,
                  creditMaximum: 6,
                  blacklistedIds: Immutable.List<string>(),
                })
                  .addToWhitelist(catalog.getCourse('COMP', '105')!)
                  .addToWhitelist(catalog.getCourse('COMP', '106')!)
                  .addToWhitelist(catalog.getCourse('COMP', '270')!)
                  .addToDefaults(catalog.getCourse('COMP', '105')!)
                  .addToDefaults(catalog.getCourse('COMP', '270')!),
              ),
          ),
      ),
  );
}

load();
