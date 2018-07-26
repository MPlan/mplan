export type Prerequisite =
  | { and: Prerequisite[] }
  | { or: Prerequisite[] }
  | [string, string, 'CONCURRENT' | 'PREVIOUS']
  | string;

export interface Course {
  subjectCode: string;
  courseNumber: string;
  name: string;
  description: string;
  creditHours: number | [number, number];
  restrictions: string[];
  prerequisites: Prerequisite;
  corequisites: Prerequisite;
}

export interface Subject {
  name: string;
  code: string;
  href: string;
}
