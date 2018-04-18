import * as Immutable from 'immutable';
import * as Record from '../recordize';
import { ObjectId, hashObjects } from './';
import { Catalog } from './catalog';
import { Course } from './course';
import { Semester } from './semester';
import { Degree } from './degree';
import { flatten } from 'lodash';

export class Plan extends Record.define({
  semesterMap: Record.MapOf(Semester),
}) {
  static unplacedCoursesMemo = new Map<any, any>();
  static warningsNotOfferedDuringSeason = new Map<any, any>();

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

  unplacedCourses(degree: Degree, catalog: Catalog): Course[] {
    ``;
    const hash = hashObjects({ plan: this, degree, catalog });
    if (Plan.unplacedCoursesMemo.has(hash)) {
      return Plan.unplacedCoursesMemo.get(hash);
    }

    const closure = degree
      .closure(catalog)
      .filter(course => course instanceof Course) as Immutable.Set<Course>;
    const coursesInPlan = this.semesterMap
      .map(semester => semester.courses(catalog))
      .reduce((coursesInPlan, courses) => coursesInPlan.union(courses), Immutable.Set<Course>());

    const unplacedCourses = closure
      .subtract(coursesInPlan)
      .sortBy(c => c.priority(degree, catalog))
      .toArray();
    Plan.unplacedCoursesMemo.set(hash, unplacedCourses);
    return unplacedCourses;
  }

  warningsNotOfferedDuringSeason(catalog: Catalog): string[] {
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

  warningsNotSatisfiedPrerequisites(catalog: Catalog): string[] {
    // HOW TO DO
    // look at previous semester, calculate,

    return [];
  }

  warningsDoesNotFillUp(catalog: Catalog): string[] {
    // HOW TO DO
    // (logic might not be right but you get the point)
    // this would throw warning if the courses always reaches full capacity.
    // you'd go through every semester and grab the list of courses,
    // for each course, you'd have to grab the sections,
    // and in each section, you'd have to look at the capacity and seats remaining
    // if all sections fill up with less than 3 seats remaining, then output a warning
    // saying that the class always fills up

    // HOW TO USE DATA MODEL
    // a plan has many semesters
    // const semester = this.semesterMap.valueSeq().first()!;
    // // a semester has many catalog ids
    // const catalogIdOfCourse = semester._courseIds.first()!;
    // // use the catalog to get a course from an id
    // const course = catalog.getCourseFromCatalogId(catalogIdOfCourse)!;
    // // use the course to grab the sections
    // const section = course.winterSections.first()!;

    // // use these to calculate
    // section.capacity
    // section.remaining

    return ['something'];
  }
}
