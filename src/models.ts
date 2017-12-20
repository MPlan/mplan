import * as Record from 'recordize';
import * as Immutable from 'immutable';

class Course extends Record.define({
}) { }

class Semester extends Record.define({
}) { }

class App extends Record.define({
  courses: Immutable.Set<Course>(),
  semesters: Immutable.Set<Semester>(),
}) { }