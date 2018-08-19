import * as Record from '../../models';
import * as Immutable from 'immutable';
import * as Model from '../../models/models';
import { store } from '../../models/store';
export { store };
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { map, debounceTime, share, distinctUntilChanged, tap, filter } from 'rxjs/operators';
import { Auth } from '../auth';

export * from '../../models';

function dispatchSaving() {
  store.sendUpdate(store => store.update('ui', ui => ui.update('saving', count => count + 1)));
}

function dispatchDoneSaving() {
  store.sendUpdate(store => store.update('ui', ui => ui.update('saving', count => count - 1)));
}

const user$ = Observable.create((observer: Observer<Record.App>) => {
  store.subscribe(store => {
    observer.next(store);
  });
}).pipe(
  share(),
  map((store: Record.App) => store.user),
  distinctUntilChanged((a: Record.User, b: Record.User) => {
    // ignores the last update date
    return a.set('lastUpdateDate', 0).equals(b.set('lastUpdateDate', 0));
  }),
) as Observable<Record.User>;

user$.pipe(debounceTime(300)).subscribe(user => {
  localStorage.setItem('user_data', JSON.stringify(user.toJS()));
});

user$
  .pipe(
    tap(dispatchSaving),
    debounceTime(3000),
  )
  .subscribe(async user => {
    console.log('sending to server...');
    const token = await Auth.token();
    await fetch(`/api/users/${user.username}`, {
      method: 'PUT',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(user.toJS()),
    });
    Record.store.sendUpdate(store => {
      const next = store.user.set('lastUpdateDate', Date.now());
      return Record.User.updateStore(store, next);
    });
    dispatchDoneSaving();
    console.log('finished sending');
  });

const masteredDegrees$ = Observable.create((observer: Observer<Record.App>) => {
  store.subscribe(store => {
    if (store.user.isAdmin) {
      observer.next(store);
    }
  });
}).pipe(
  share(),
  map((store: Record.App) => store.masteredDegrees),
  distinctUntilChanged(),
) as Observable<Immutable.Map<string, Record.MasteredDegree>>;

masteredDegrees$
  .pipe(
    tap(dispatchSaving),
    debounceTime(3000),
  )
  .subscribe(async user => {
    const token = await Auth.token();
    await fetch(`/api/degrees`, {
      method: 'PUT',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(user.toJS()),
    });
    dispatchDoneSaving();
  });

const admin$ = Observable.create((observer: Observer<Record.App>) => {
  store.subscribe(store => {
    if (store.user.isAdmin) {
      observer.next(store);
    }
  });
}).pipe(
  share(),
  map((store: Record.App) => store.admins),
  distinctUntilChanged(),
) as Observable<string[]>;

admin$
  .pipe(
    filter(admins => admins.length > 0),
    tap(dispatchSaving),
    debounceTime(3000),
  )
  .subscribe(async admins => {
    const token = await Auth.token();
    await fetch('/api/admins', {
      method: 'PUT',
      headers: new Headers({
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(admins),
    });
    dispatchDoneSaving();
  });

async function fetchCatalog() {
  const token = await Auth.token();
  const response = await fetch('/api/catalog', {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });
  const joinedCatalog = (await response.json()) as Model.JoinedCatalog;
  return Record.Catalog.fromJS({ courseMap: joinedCatalog });
}

async function fetchUser() {
  const token = await Auth.token();
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
    return new Record.User({
      _id: Record.ObjectId(),
      username: uniqueName,
      registerDate: Date.now(),
    });
  }
  const user = Record.User.fromJS(await response.json());
  return user;
}

async function fetchMasteredDegrees() {
  const token = await Auth.token();
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

async function fetchAdmins() {
  const token = await Auth.token();
  const response = await fetch('/api/admins/', {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  const admins = (await response.json()) as string[];
  return admins;
}

async function fetchPrerequisitesOverrides() {
  const token = await Auth.token();
  const response = await fetch('/api/prerequisite-overrides/', {
    headers: new Headers({
      Authorization: `Bearer ${token}`,
    }),
  });

  const prerequisiteOverrides = (await response.json()) as {
    [courseKey: string]: Model.Prerequisite;
  };
  return prerequisiteOverrides;
}

async function load() {
  const [catalog, userFromServer, degrees, admins, prerequisiteOverrides] = await Promise.all([
    fetchCatalog(),
    fetchUser(),
    fetchMasteredDegrees(),
    fetchAdmins(),
    fetchPrerequisitesOverrides(),
  ]);

  store.sendUpdate(store =>
    store
      .set('catalog', catalog)
      .set('user', userFromServer!)
      .set('masteredDegrees', degrees)
      .set('admins', admins)
      .set('prerequisiteOverrides', prerequisiteOverrides)
      .updateUi(ui =>
        ui
          .set('loaded', true)
          .set('saving', 0)
          .set('isAdmin', userFromServer!.isAdmin),
      ),
  );
}

load();
