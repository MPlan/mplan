import * as Course from './course';
import { ObjectId } from 'utilities/object-id';

describe('course', () => {
  describe('disjunctiveNormalForm', () => {
    const cis375: Course.Model = {
      id: ObjectId(),
      name: 'Software Engineering I',
      subjectCode: 'CIS',
      courseNumber: '375',
      lastUpdateDate: Date.now(),
      // prettier-ignore
      prerequisites: {and: [
        {or: [
            ['COMP', '270', 'PREVIOUS'],
            ['COMP', '106', 'PREVIOUS'],
            ['COMP', '220', 'PREVIOUS'],
            'CPAS with a score of 40',
        ]},
        {or: [
          {or: [
            ['CIS', '350', 'PREVIOUS'],
            ['CIS', '3501', 'PREVIOUS'],
            ['IMSE', '350', 'PREVIOUS'],
          ]},
          {or: [
            {and: [
              ['ECE', '370', 'PREVIOUS'],
              ['MATH', '276', 'PREVIOUS'],
            ]},
            {and: [
              ['ECE', '370', 'PREVIOUS'],
              ['ECE', '276', 'PREVIOUS'],
            ]},
          ]},
        ]},
      ]}
    };

    const comp270: Course.Model = {
      id: ObjectId(),
      name: 'Technical Writing for Engineers',
      subjectCode: 'COMP',
      courseNumber: '270',
      lastUpdateDate: Date.now(),
    };

    const comp106: Course.Model = {
      id: ObjectId(),
      name: 'Writing and Rhetoric II',
      subjectCode: 'COMP',
      courseNumber: '106',
      lastUpdateDate: Date.now(),
    };

    const comp220: Course.Model = {
      id: ObjectId(),
      name: 'Honors Writing and Rhetoric II',
      subjectCode: 'COMP',
      courseNumber: '220',
      lastUpdateDate: Date.now(),
    };

    const cis350: Course.Model = {
      id: ObjectId(),
      name: 'Data Structures and Algorithms',
      subjectCode: 'CIS',
      courseNumber: '350',
      lastUpdateDate: Date.now(),
    };

    const cis3501: Course.Model = {
      id: ObjectId(),
      name: 'Data Structures and Algorithms for Software Engineers',
      subjectCode: 'CIS',
      courseNumber: '350',
      lastUpdateDate: Date.now(),
    };

    const imse350: Course.Model = {
      id: ObjectId(),
      name: 'Data Structures',
      subjectCode: 'IMSE',
      courseNumber: '350',
      lastUpdateDate: Date.now(),
    };

    const ece370: Course.Model = {
      id: ObjectId(),
      name: 'Adv Soft Techn in Comp Engr',
      subjectCode: 'ECE',
      courseNumber: '370',
      lastUpdateDate: Date.now(),
    };

    const math276: Course.Model = {
      id: ObjectId(),
      name: 'Discrete Math Meth Comptr Engr',
      subjectCode: 'MATH',
      courseNumber: '276',
      lastUpdateDate: Date.now(),
    };

    const ece276: Course.Model = {
      id: ObjectId(),
      name: 'Discrete Math in Computer Engr',
      subjectCode: 'ECE',
      courseNumber: '276',
      lastUpdateDate: Date.now(),
    };

    const catalog: { [catalogId: string]: Course.Model } = {
      [Course.getCatalogId(cis375)]: cis375,
      [Course.getCatalogId(comp270)]: comp270,
      [Course.getCatalogId(comp106)]: comp106,
      [Course.getCatalogId(comp220)]: comp220,
      [Course.getCatalogId(cis350)]: cis350,
      [Course.getCatalogId(cis3501)]: cis3501,
      [Course.getCatalogId(imse350)]: imse350,
      [Course.getCatalogId(ece370)]: ece370,
      [Course.getCatalogId(math276)]: math276,
      [Course.getCatalogId(ece276)]: ece276,
    };

    it('calculates DNF', () => {
      const result = Course.disjunctiveNormalForm(cis375.prerequisites, catalog);
      const readableResult = Array.from(result.values()).map(option =>
        Array.from(option.values()).map(
          ([course]) => (Course.isCourse(course) ? Course.getSimpleName(course) : course),
        ),
      );

      const expected = [
        ['COMP 270', 'CIS 350'],
        ['COMP 270', 'CIS 3501'],
        ['COMP 270', 'IMSE 350'],
        ['COMP 270', 'ECE 370', 'MATH 276'],
        ['COMP 270', 'ECE 370', 'ECE 276'],
        ['COMP 106', 'CIS 350'],
        ['COMP 106', 'CIS 3501'],
        ['COMP 106', 'IMSE 350'],
        ['COMP 106', 'ECE 370', 'MATH 276'],
        ['COMP 106', 'ECE 370', 'ECE 276'],
        ['COMP 220', 'CIS 350'],
        ['COMP 220', 'CIS 3501'],
        ['COMP 220', 'IMSE 350'],
        ['COMP 220', 'ECE 370', 'MATH 276'],
        ['COMP 220', 'ECE 370', 'ECE 276'],
        ['CPAS with a score of 40', 'CIS 350'],
        ['CPAS with a score of 40', 'CIS 3501'],
        ['CPAS with a score of 40', 'IMSE 350'],
        ['CPAS with a score of 40', 'ECE 370', 'MATH 276'],
        ['CPAS with a score of 40', 'ECE 370', 'ECE 276'],
      ];

      expect(readableResult).toEqual(expected);
    });
  });
});
