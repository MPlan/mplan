import * as Model from './';
import { Course, disjunctiveNormalForm } from './course';

describe('Course', () => {
  describe('disjunctiveNormalForm', () => {
    it('computes disjunctive normal form correctly', () => {
      const cis350 = new Course({
        _id: Model.ObjectId(),
        subjectCode: 'CIS',
        courseNumber: '350',
      });

      const cis3501 = new Course({
        _id: Model.ObjectId(),
        subjectCode: 'CIS',
        courseNumber: '3501',
      });

      const imse350 = new Course({
        _id: Model.ObjectId(),
        subjectCode: 'IMSE',
        courseNumber: '350',
      });

      const ece370 = new Course({
        _id: Model.ObjectId(),
        subjectCode: 'ECE',
        courseNumber: '370',
      });

      const math276 = new Course({
        _id: Model.ObjectId(),
        subjectCode: 'MATH',
        courseNumber: '276',
      });

      const comp270 = new Course({
        _id: Model.ObjectId(),
        subjectCode: 'COMP',
        courseNumber: '270',
      });

      const comp106 = new Course({
        _id: Model.ObjectId(),
        subjectCode: 'COMP',
        courseNumber: '106',
      });

      const comp220 = new Course({
        _id: Model.ObjectId(),
        subjectCode: 'COMP',
        courseNumber: '220',
      });

      const cis375 = new Course({
        _id: Model.ObjectId(),
        subjectCode: 'CIS',
        courseNumber: '375',
        prerequisites: {
          and: [
            {
              or: [
                {
                  or: [
                    ['CIS', '350', 'PREVIOUS'],
                    ['CIS', '3501', 'PREVIOUS'],
                    ['IMSE', '350', 'PREVIOUS'],
                  ],
                },
                {
                  and: [['ECE', '370', 'PREVIOUS'], ['MATH', '276', 'PREVIOUS']],
                },
              ],
            },
            {
              or: [
                ['COMP', '270', 'PREVIOUS'],
                ['COMP', '106', 'PREVIOUS'],
                ['COMP', '220', 'PREVIOUS'],
              ],
            },
          ],
        },
      });

      const catalog = new Model.Catalog()
        .addCourse(cis350)
        .addCourse(cis3501)
        .addCourse(imse350)
        .addCourse(ece370)
        .addCourse(math276)
        .addCourse(comp270)
        .addCourse(comp106)
        .addCourse(comp220)
        .addCourse(cis375);

      const result = disjunctiveNormalForm(cis375.prerequisitesConsideringOverrides, catalog);

      const readableResults = result
        .map(disjunct =>
          disjunct
            .map(tuple => {
              const { course: courseOrString, canTakeConcurrently } = tuple;
              const previousOrConcurrent = canTakeConcurrently ? 'CONCURRENT' : 'PREVIOUS';
              if (typeof courseOrString !== 'string') {
                return `${courseOrString.simpleName} ${previousOrConcurrent}`;
              }

              return `${courseOrString} ${previousOrConcurrent}`;
            })
            .toArray(),
        )
        .toArray();

      expect(readableResults).toMatchInlineSnapshot(`
Array [
  Array [
    "CIS 3501 PREVIOUS",
    "COMP 270 PREVIOUS",
  ],
  Array [
    "IMSE 350 PREVIOUS",
    "COMP 270 PREVIOUS",
  ],
  Array [
    "CIS 3501 PREVIOUS",
    "COMP 220 PREVIOUS",
  ],
  Array [
    "IMSE 350 PREVIOUS",
    "COMP 106 PREVIOUS",
  ],
  Array [
    "ECE 370 PREVIOUS",
    "MATH 276 PREVIOUS",
    "COMP 106 PREVIOUS",
  ],
  Array [
    "IMSE 350 PREVIOUS",
    "COMP 220 PREVIOUS",
  ],
  Array [
    "CIS 350 PREVIOUS",
    "COMP 270 PREVIOUS",
  ],
  Array [
    "CIS 3501 PREVIOUS",
    "COMP 106 PREVIOUS",
  ],
  Array [
    "CIS 350 PREVIOUS",
    "COMP 106 PREVIOUS",
  ],
  Array [
    "CIS 350 PREVIOUS",
    "COMP 220 PREVIOUS",
  ],
  Array [
    "ECE 370 PREVIOUS",
    "MATH 276 PREVIOUS",
    "COMP 220 PREVIOUS",
  ],
  Array [
    "ECE 370 PREVIOUS",
    "MATH 276 PREVIOUS",
    "COMP 270 PREVIOUS",
  ],
]
`);
    });
  });
});
