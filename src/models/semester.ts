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
  season: 'Fall' as 'Fall' | 'Winter' | 'Summer',
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
      /*if*/ this.season === 'Winter' ? 0 : /*if*/ this.season === 'Summer' ? 1 / 3 : 2 / 3;
    return seasonNumber + this.year;
  }

  get name() {
    return `${this.season} ${this.year}`;
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
      .map(course => course.credits || 0)
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
    return this.update('_courseIds', courseIds => courseIds.push(course.catalogId));
  }

  deleteCourse(courseToDelete: Course) {
    return this.update('_courseIds', courseIds => {
      return courseIds.filter(courseId => courseToDelete.catalogId !== courseId);
    });
  }

  private _previousSemesterSeason() {
    if (this.season === 'Winter') {
      return 'Fall';
    }
    if (this.season === 'Fall') {
      return 'Summer';
    }
    if (this.season === 'Summer') {
      return 'Winter';
    }
    throw new Error('season was neither Winter, Fall, or Summer');
  }

  private _previousSemesterYear() {
    if (this.season === 'Winter') {
      return this.year - 1;
    }
    return this.year;
  }

  private _nextSemesterSeason() {
    if (this.season === 'Winter') {
      return 'Summer';
    }
    if (this.season === 'Fall') {
      return 'Winter';
    }
    if (this.season === 'Summer') {
      return 'Fall';
    }
    throw new Error('season was neither Winter, Fall, or Summer');
  }

  private _nextSemesterYear() {
    if (this.season === 'Fall') {
      return this.year + 1;
    }
    return this.year;
  }

  previousSemester(): { season: 'Fall' | 'Winter' | 'Summer'; year: number } {
    const season = this._previousSemesterSeason();
    const year = this._previousSemesterYear();
    return { season, year };
  }

  nextSemester(): { season: 'Fall' | 'Winter' | 'Summer'; year: number } {
    const season = this._nextSemesterSeason();
    const year = this._nextSemesterYear();
    return { season, year };
  }
}
