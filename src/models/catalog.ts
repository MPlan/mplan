import { Course } from './course';

export interface Catalog {
  [catalogId: string]: Course;
}
