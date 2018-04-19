import * as Immutable from 'immutable';
import * as Record from '../recordize';
import { ObjectId, hashObjects } from './';
import { Catalog } from './catalog';
import { Course } from './course';
import { Semester } from './semester';
import { Degree } from './degree';
import { flatten } from 'lodash';

export class Plan extends Record.define({
  semesterMap: Record.MapOf(Semester)
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
      season: nextSemester.season
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
            semester
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
                    : false
          }))
          .filter(({ hasRanDuringSeason }) => !hasRanDuringSeason)
          .map(
            ({ course, semester }) =>
              `Course ${course.simpleName} has never ran during the ${semester.season}`
          )
          .toArray()
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
    // ArrayList<String> warningsArray = new ArrayList<>(); // java version
    const warningsArray: Array<string> = [];
    warningsArray.push('-- Class Capacity Warnings --');
    warningsArray.push(' ');
    let semLength = this.semesterMap.count();
    for (let i = 0; i < semLength; i += 1) {
      const semester = this.semesterMap.valueSeq().get(i)!;
      for (let j = 0; j < semester.courseCount; j += 1) {
        const catalogIdOfCourse = semester._courseIds.get(j)!;
        const course = catalog.getCourseFromCatalogId(catalogIdOfCourse)!;

        const winterSection = course.winterSections.valueSeq().first();
        const summerSection = course.summerSections.valueSeq().first();
        const fallSection = course.fallSections.valueSeq().first();

        if (semester.season === 'Winter') {
          if (!winterSection) continue;

          if (winterSection.remaining <= 3) {
            if(winterSection.remaining > 0){
            warningsArray.push(`${course.simpleName} had: ${winterSection.remaining} seats remaining last winter`);
            }
            else
            warningsArray.push(`${course.simpleName} was completely full last winter`);            
          }
        } //if === 'Winter'

        if (semester.season === 'Summer') {
          if (!summerSection) continue;

          if (summerSection.remaining <= 3) {
            if(summerSection.remaining > 0){
              warningsArray.push(`${course.simpleName} had: ${summerSection.remaining} seats remaining last summer`);
            }
            else
            warningsArray.push(`${course.simpleName} was completely full last summer`); 
            
          }
        } //if === 'Summer'
        if (semester.season === 'Fall') {
          if (!fallSection) continue;

          if (fallSection.remaining <= 3) {
            if(fallSection.remaining > 0){
              warningsArray.push(`${course.simpleName} had: ${fallSection.remaining} seats remaining last fall`);
            }
            else
            warningsArray.push(`${course.simpleName} was completely full last fall`);
          }
        } //if === 'Fall'
      } //for j
      // // a semester has many catalog ids

      // // use the catalog to get a course from an id

      // // use the course to grab the sections

      // // use these to calculate
      // section.capacity
    } //for i

    if (warningsArray.length === 0) {
      return ['no warnings for filling up'];
    } else return warningsArray;
  }
}
