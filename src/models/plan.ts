import * as Immutable from 'immutable';
import * as Record from '../recordize';
import { ObjectId, hashObjects } from './';
import { Course } from './course';
import { Semester } from './semester';
import { flatten } from 'lodash';
import { pointer } from './pointer';
import { App } from './app';

export class Plan extends Record.define({
  semesterMap: Record.MapOf(Semester),
}) {
  static unplacedCoursesMemo = new Map<any, any>();
  static warningsNotOfferedDuringSeason = new Map<any, any>();
  get root(): App {
    return pointer.store.current();
  }
  updateSemester(id: string, updater: (semester: Semester) => Semester) {
    return this.update('semesterMap', map => map.update(id, updater));
  }

  lastSemester() {
    return this.semesterMap
      .valueSeq()
      .sortBy(semester => semester.position)
      .reverse()
      .first();
  }

  createNewSemester() {
    const lastSemester = this.lastSemester();
    if (!lastSemester) {
      return this;
    }
    const nextSemester = lastSemester.nextSemester();
    const newSemester = new Semester({
      _id: ObjectId(),
      year: nextSemester.year,
      season: nextSemester.season,
    });
    return this.update('semesterMap', map => map.set(newSemester.id, newSemester));
  }

  unplacedCourses(): Course[] {
    const degree = this.root.user.degree;
    const catalog = this.root.catalog;
    const hash = hashObjects({ plan: this, degree, catalog });
    if (Plan.unplacedCoursesMemo.has(hash)) {
      return Plan.unplacedCoursesMemo.get(hash);
    }

    const closure = degree.closure().filter(course => course instanceof Course) as Immutable.Set<
      Course
    >;
    const coursesInPlan = this.semesterMap
      .map(semester => semester.courses())
      .reduce((coursesInPlan, courses) => coursesInPlan.union(courses), Immutable.Set<Course>());

    const unplacedCourses = closure
      .subtract(coursesInPlan)
      .sortBy(c => c.priority())
      .toArray();
    Plan.unplacedCoursesMemo.set(hash, unplacedCourses);
    return unplacedCourses;
  }

  warningsNotOfferedDuringSeason(): string[] {
    const catalog = this.root.catalog;
    const hash = hashObjects({ plan: this, catalog });
    if (Plan.warningsNotOfferedDuringSeason.has(hash)) {
      return Plan.warningsNotOfferedDuringSeason.get(hash);
    }
    const allCourses = this.semesterMap
      .valueSeq()
      .map(semester =>
        semester._courseIds
          .map(courseId => ({
            course: catalog.courseMap.get(courseId)!,
            semester,
          }))
          .filter(({ course }) => !!course)
          .map(({ course, semester }) => ({
            course,
            semester,
            hasRanDuringSeason:
              semester.season === 'Winter'
                ? course.winterSections.count() > 0
                : semester.season === 'Summer'
                  ? course.summerSections.count() > 0
                  : semester.season === 'Fall'
                    ? course.winterSections.count() > 0
                    : false,
          }))
          .filter(({ hasRanDuringSeason }) => !hasRanDuringSeason)
          .map(
            ({ course, semester }) =>
              `Course ${course.simpleName} has never ran during the ${semester.season}`,
          )
          .toArray(),
      )
      .toArray();
    const allWarningsFlattened = flatten(allCourses);

    Plan.warningsNotOfferedDuringSeason.set(hash, allWarningsFlattened);
    return allWarningsFlattened;
  }

  // TODO:
  // validate() {

  // }
}
