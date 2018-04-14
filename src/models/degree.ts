import * as Immutable from 'immutable';
import * as Record from '../recordize';
import * as Model from './models';
import { ObjectId, hashObjects } from './';
import { Section } from './section';
import { Catalog } from './catalog';
import { Course } from './course';
import { Semester } from './semester';
import { DegreeGroup } from './degree-group';
import { Plan } from './plan';

export function printSchedule(schedule: Immutable.List<Immutable.Set<Course>>) {
  const totalCourses = schedule.reduce((total, semester) => total + semester.count(), 0);
  console.log('semesters:', schedule.count(), 'course count:', totalCourses);

  const prettySchedule = schedule
    .map(semester =>
      semester
        .map(
          course =>
            /*if*/ course instanceof Course
              ? `${course.simpleName} (${course.credits || course.creditHours || 0})`
              : course,
        )
        .join(', '),
    )
    .join('\n');

  console.log(prettySchedule);
  console.log('-------');
}

export function generatePlans(degree: Degree, catalog: Catalog) {
  // === DEFINE CONSTANTS ===
  const creditHourCap = 14;
  const semesterCap = 15;

  // === DEFINE STATE VARIABLES ===
  let currentSchedule = Immutable.List<Immutable.Set<Course>>();
  let currentSemester = Immutable.Set<Course>();
  let processedCourses = Immutable.Set<string | Course>();
  let unplacedCourses = Immutable.Set<Course>();
  let scheduleCount = 0;

  // === INITIALIZE WITH INITIAL STATE ===
  const closure = degree.closure(catalog);
  processedCourses = closure.filter(prerequisite => typeof prerequisite === 'string');
  unplacedCourses = closure
    .filter(prerequisite => prerequisite instanceof Course)
    .map(c => c as Course);

  /**
   * returns whether a course can be placed in a semester
   */
  function canPlace(course: Course, semester: Immutable.Set<Course>) {
    const totalCredits = semester.reduce(
      (sum, course) => sum + (course.credits || course.creditHours || 0),
      0,
    );
    const newCourseCredits = course.credits || course.creditHours || 0;

    if (totalCredits + newCourseCredits > creditHourCap) return false;
    if (!course.prerequisitesSatisfied(catalog, processedCourses)) return false;
    return true;
  }

  /**
   * the recursive backtracking function
   */
  function _generatePlan(): boolean {
    const unplacedCount = unplacedCourses.count();
    if (unplacedCount <= 0) {
      scheduleCount += 1;
      currentSchedule = currentSchedule.push(currentSemester);
      return true;
    }

    const unplacedCoursesSorted = unplacedCourses.toList().sortBy(c => c.priority(degree, catalog));
    for (let i = 0; i < unplacedCount; i += 1) {
      const course = unplacedCoursesSorted.get(i)!;
      if (canPlace(course, currentSemester)) {
        currentSemester = currentSemester.add(course);
        unplacedCourses = unplacedCourses.remove(course);

        if (_generatePlan()) return true;
      }
    }

    if (currentSchedule.count() < semesterCap) {
      const oldSemester = currentSemester;
      processedCourses = processedCourses.union(oldSemester);
      currentSchedule = currentSchedule.push(oldSemester);
      currentSemester = Immutable.Set<Course>();

      if (_generatePlan()) return true;
    }

    return false;
  }

  _generatePlan();

  return currentSchedule;
}

export class Degree extends Record.define({
  degreeGroups: Record.ListOf(DegreeGroup),
}) {
  static preferredCoursesMemo = new Map<any, any>();
  static closureMemo = new Map<any, any>();
  static levelsMemo = new Map<any, any>();

  preferredCourses(catalog: Catalog) {
    const hash = hashObjects({
      degree: this,
      catalog,
    });
    if (Degree.preferredCoursesMemo.has(hash)) {
      return Degree.preferredCoursesMemo.get(hash) as Immutable.Set<string | Course>;
    }

    const combined = this.degreeGroups.reduce(
      (combined, group) => combined.union(group.courses(catalog)),
      Immutable.Set<string | Course>(),
    );
    Degree.preferredCoursesMemo.set(hash, combined);
    return combined;
  }

  closure(catalog: Catalog): Immutable.Set<string | Course> {
    const hash = hashObjects({ catalog, degree: this });
    if (Degree.closureMemo.has(hash)) {
      return Degree.closureMemo.get(hash);
    }

    const preferredCourses = this.preferredCourses(catalog);

    const closure = preferredCourses
      .map(
        course =>
          /*if*/ course instanceof Course
            ? course.closure(catalog, preferredCourses)
            : Immutable.Set<string | Course>().add(course),
      )
      .reduce(
        (closure, courseClosure) => closure.union(courseClosure),
        Immutable.Set<string | Course>(),
      );

    Degree.closureMemo.set(hash, closure);
    return closure;
  }

  levels(catalog: Catalog): Immutable.List<Immutable.Set<string | Course>> {
    const hash = hashObjects({ degree: this, catalog });
    if (Degree.levelsMemo.has(hash)) {
      return Degree.levelsMemo.get(hash);
    }

    const closure = this.closure(catalog);
    const levelsMutable = [] as Array<Set<string | Course>>;
    const preferredCourses = this.preferredCourses(catalog);

    for (const course of closure) {
      if (course instanceof Course) {
        const depth = course.depth(catalog, preferredCourses);
        const set = levelsMutable[depth] || new Set<string | Course>();
        set.add(course);
        levelsMutable[depth] = set;
      }
    }

    const levels = levelsMutable.reduce(
      (levelsImmutable, mutableLevel) =>
        levelsImmutable.push(Immutable.Set<string | Course>(mutableLevel)),
      Immutable.List<Immutable.Set<string | Course>>(),
    );

    Degree.levelsMemo.set(hash, levels);
    return levels;
  }

  totalCredits(catalog: Catalog): number {
    return this.getOrCalculate('totalCredits', [catalog, this], () => {
      return this.degreeGroups.reduce(
        (totalCredits, group) =>
          totalCredits +
          group
            .courses(catalog)
            .reduce(
              (totalCredits, course) =>
                totalCredits +
                (course instanceof Course ? course.credits || course.creditHours || 0 : 0),
              0,
            ),
        0,
      );
    });
  }

  completedCredits(catalog: Catalog): number {
    return 0;
  }

  percentComplete(catalog: Catalog) {
    return this.completedCredits(catalog) / this.totalCredits(catalog);
  }

  generatePlan(catalog: Catalog) {
    const plan = generatePlans(this, catalog);
    const semesterMap = plan
      .map(
        (set, i) =>
          new Semester({
            _id: ObjectId(),
            season: ['Winter', 'Summer', 'Fall'][i % 3] as any,
            year: Math.floor(i / 3) + 2018,
            _courseIds: set.map(course => course.catalogId).toList(),
          }),
      )
      .reduce((semesterMap, semester) => {
        return semesterMap.set(semester.id, semester);
      }, Immutable.Map<string, Semester>());

    return new Plan({
      semesterMap,
    });
  }

  addDegreeGroup(group: DegreeGroup) {
    return this.update('degreeGroups', groups => groups.push(group));
  }

  deleteDegreeGroup(group: DegreeGroup) {
    return this.update('degreeGroups', groups => groups.filter(g => g !== group));
  }

  updateDegreeGroup(group: DegreeGroup, update: (group: DegreeGroup) => DegreeGroup) {
    return this.update('degreeGroups', groups => {
      const index = groups.findIndex(g => g === group);
      return groups.update(index, update);
    });
  }
}
