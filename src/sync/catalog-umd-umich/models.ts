type Prerequisite = { and: Prerequisite[] } | { or: Prerequisite[] } | [string, string, boolean];

export interface Course {
  subjectCode: string;
  courseNumber: string;
  name: string;
  description: string;
  prerequisites: Prerequisite;
  corequisites: Prerequisite;
  restrictions: string[];
  creditHours: number | [number, number];
}

export interface Subject {
  name: string;
  code: string;
  href: string;
}
