import { ObjectId } from 'utilities/object-id';
import * as Semester from './semester';

interface Plan {
  anchorSeason: string;
  anchorYear: number;
  semesters: Semester.Model[];
}
export { Plan as Model };

export function getAnchorValue(self: Plan) {
  return self.anchorYear * 3 + self.anchorSeason;
}

export function getAnchorSeasonValue(self: Plan) {
  if (self.anchorSeason === 'winter') return 0;
  if (self.anchorSeason === 'summer') return 1;
  if (self.anchorSeason === 'fall') return 2;
  throw new Error('unhit anchor season value case');
}

export function getUnplacedCourses(self: Plan) {
  return [];
}

export function updateSemester(
  self: Plan,
  semesterId: string,
  updater: (semester: Semester.Model) => Semester.Model,
): Plan {
  const { semesters } = self;

  const semesterToUpdateIndex = semesters.findIndex(semester => semester.id === semesterId);
  if (semesterToUpdateIndex === -1) return self;

  const updatedSemester = updater(semesters[semesterToUpdateIndex]);

  const newSemesters = [
    ...semesters.slice(0, semesterToUpdateIndex),
    updatedSemester,
    ...semesters.slice(semesterToUpdateIndex + 1, semesters.length),
  ];

  return {
    ...self,
    semesters: newSemesters,
  };
}

export function createNewSemester(self: Plan): Plan {
  const { semesters } = self;
  const newSemester: Semester.Model = {
    id: ObjectId(),
    courseIds: [],
  };

  return {
    ...self,
    semesters: [...semesters, newSemester],
  };
}

export function deleteSemester(self: Plan, semesterToDelete: Semester.Model): Plan {
  const { semesters } = self;

  const newSemesters = semesters.filter(semester => semester.id !== semesterToDelete.id);

  return {
    ...self,
    semesters: newSemesters,
  };
}
