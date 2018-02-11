import * as Record from 'recordize';
export * from '../../models/records';
import * as Immutable from 'immutable';
import * as Model from '../../models/models';
import { App, Course, ObjectId } from '../../models/records';
export const store = Record.createStore(new App());

async function fetchCourses() {
  const response = await fetch('/api/courses');
  const courses = await response.json();
  const courseMap = Object.entries(courses).reduce((obj, [courseId, _course]) => {
    const course = {
      ..._course,
      _id: ObjectId((_course as any)._id)
    };
    return obj.set(courseId, new Course(course));
  }, Immutable.Map<string, Course>());
  return courseMap;
}

async function updateStoreWithCatalog() {
  const courseMap = await fetchCourses();
  store.sendUpdate(store =>
    store.update('catalog', catalog =>
      catalog.set('courseMap', courseMap)
    )
  );
}

updateStoreWithCatalog();