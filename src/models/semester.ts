import * as Immutable from 'immutable';
import * as Record from '../recordize';
import { ObjectId } from './';
import { Course } from './course';
import { pointer } from './pointer';
import { App } from './app';

export class Semester extends Record.define({
  _id: ObjectId(),
  /** these are in the form `__subjectCode|courseNumber__` */
  _courseIds: Immutable.List<string>(),
  season: 'fall' as 'fall' | 'winter' | 'summer',
  year: 0,
}) {
  get root(): App {
    return pointer.store.current();
  }
  get id() {
    return this._id.toHexString();
  }

  get position() {
    const seasonNumber =
      /*if*/ this.season === 'winter' ? 0 : /*if*/ this.season === 'summer' ? 1 / 3 : 2 / 3;
    return seasonNumber + this.year;
  }

  get name() {
    const seasonFirstLetter = this.season.substring(0, 1).toUpperCase();
    const seasonRest = this.season.substring(1);
    return `${seasonFirstLetter}${seasonRest} ${this.year}`;
  }

  get shortName() {
    return `${this.season.substring(0, 1)}${this.year}`;
  }

  get courseCount() {
    return this.getOrCalculate('courseCount', () => {
      return this._courseIds.count();
    });
  }

  totalCredits() {
    return this.courses()
      .map(
        course =>
          Array.isArray(course.creditHours) ? course.creditHours[1] : course.creditHours || 0,
      )
      .reduce((sum, next) => sum + next, 0);
  }

  courses() {
    const catalog = this.root.catalog;
    return this.getOrCalculate('courses', [catalog, this], () => {
      return this._courseIds.map(courseId => catalog.courseMap.get(courseId)!);
    });
  }

  courseArray() {
    const catalog = this.root.catalog;
    return this.getOrCalculate('courseArray', [catalog, this], () => {
      return this._courseIds.map(courseId => catalog.courseMap.get(courseId)!).toArray();
    });
  }

  addCourse(course: Course) {
    return this.update('_courseIds', courseIds =>
      courseIds.filter(courseId => course.catalogId !== courseId).push(course.catalogId),
    );
  }

  deleteCourse(courseToDelete: Course) {
    return this.update('_courseIds', courseIds => {
      return courseIds.filter(courseId => courseToDelete.catalogId !== courseId);
    });
  }

  clearCourses() {
    return this.update('_courseIds', courseIds => courseIds.clear());
  }

  private _previousSemesterSeason() {
    if (this.season === 'winter') {
      return 'fall';
    }
    if (this.season === 'fall') {
      return 'summer';
    }
    if (this.season === 'summer') {
      return 'winter';
    }
    throw new Error('season was neither Winter, Fall, or Summer');
  }

  private _previousSemesterYear() {
    if (this.season === 'winter') {
      return this.year - 1;
    }
    return this.year;
  }

  private _nextSemesterSeason() {
    if (this.season === 'winter') {
      return 'summer';
    }
    if (this.season === 'fall') {
      return 'winter';
    }
    if (this.season === 'summer') {
      return 'fall';
    }
    throw new Error('season was neither Winter, Fall, or Summer');
  }

  private _nextSemesterYear() {
    if (this.season === 'fall') {
      return this.year + 1;
    }
    return this.year;
  }

  previousSemester(): { season: 'fall' | 'winter' | 'summer'; year: number } {
    const season = this._previousSemesterSeason();
    const year = this._previousSemesterYear();
    return { season, year };
  }

  nextSemester(): { season: 'fall' | 'winter' | 'summer'; year: number } {
    const season = this._nextSemesterSeason();
    const year = this._nextSemesterYear();
    return { season, year };
  }
}
