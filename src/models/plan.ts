interface Plan {
  anchorSeason: string;
  anchorYear: number;
  semesters: Semester[];
}

export function anchorValue(self: Plan) {
  return self.anchorYear * 3 + self.anchorSeason;
}

export function anchorSeasonValue(self: Plan) {
  if (self.anchorSeason === 'winter') return 0;
  if (self.anchorSeason === 'summer') return 1;
  if (self.anchorSeason === 'fall') return 2;
  throw new Error('unhit anchor season value case');
}

export function updateSemester(
  self: Plan,
  semesterId: string,
  updater: (semester: Semster) => Semester,
): Plan {}

export class Plan extends Record.define({
  anchorSeason: 'fall' as 'fall' | 'winter' | 'summer',
  anchorYear: new Date().getFullYear(),
  semesters: Record.ListOf(Semester),
}) {
  static unplacedCoursesMemo = new Map<any, any>();
  static warningsNotOfferedDuringSeason = new Map<any, any>();

  updateSemester(id: string, updater: (semester: Semester) => Semester) {
    return this.update('semesters', list => {
      const semesterIndexToUpdate = list.findIndex(semester => semester.id === id);
      if (semesterIndexToUpdate === -1) return list;
      return list.update(semesterIndexToUpdate, updater);
    });
  }

  createNewSemester() {
    const newSemester = new Semester({ _id: ObjectId() });
    return this.update('semesters', semesters => semesters.push(newSemester));
  }

  deleteSemester(id: string) {
    return this.update('semesters', semesters => semesters.filter(semester => semester.id !== id));
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
    const coursesInPlan = this.semesters
      .map(semester => semester.courses())
      .reduce((coursesInPlan, courses) => coursesInPlan.union(courses), Immutable.Set<Course>());

    const unplacedCourses = closure
      .subtract(coursesInPlan)
      .sortBy(c => c.priority())
      .toArray();
    Plan.unplacedCoursesMemo.set(hash, unplacedCourses);
    return unplacedCourses;
  }
}
