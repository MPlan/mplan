import * as fs from "fs";
import * as path from "path";
import * as Immutable from "immutable";
import * as Record from "./records";
const rawCatalog = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "./catalog.json")).toString()
);

import { convertCatalogJsonToRecord } from "./records";

describe("record models", () => {
  let catalog: Record.Catalog;

  beforeAll(() => {
    catalog = convertCatalogJsonToRecord(rawCatalog);
  });

  it("allCombinations", () => {
    const one = new Record.Course({ name: "1" });
    const setOne = Immutable.Set<Record.Course>([one]);
    const setSetOne = Immutable.Set<Immutable.Set<Record.Course>>([setOne]);

    const a = new Record.Course({ name: "A" });
    const b = new Record.Course({ name: "B" });
    const setA = Immutable.Set<Record.Course>([a]);
    const setB = Immutable.Set<Record.Course>([b]);
    const setAB = Immutable.Set<Immutable.Set<Record.Course>>([setA, setB]);

    const x = new Record.Course({ name: "X" });
    const y = new Record.Course({ name: "Y" });
    const setX = Immutable.Set<Record.Course>([x]);
    const setY = Immutable.Set<Record.Course>([y]);
    const setXY = Immutable.Set<Immutable.Set<Record.Course>>([setX, setY]);

    const result = Record.allCombinations([setAB, setXY, setSetOne]);

    const expectedResult = Immutable.Set<Immutable.Set<Record.Course>>()
      .add(Immutable.Set<Record.Course>([one, a, x]))
      .add(Immutable.Set<Record.Course>([one, a, y]))
      .add(Immutable.Set<Record.Course>([one, b, x]))
      .add(Immutable.Set<Record.Course>([one, b, y]));

    expect(result.equals(expectedResult)).toBe(true);
  });

  it("convertCatalogJsonToRecord", () => {
    expect(Immutable.isImmutable(catalog)).toBe(true);
    const cis450 = catalog.getCourse("CIS", "450")!;
    expect(cis450.name).toBe("Operating Systems");
  });

  it("prerequisitesFlattened", () => {
    const course = catalog.getCourse("CIS", "450")!;
    const prerequisitesFlattened = course.options(catalog);

    console.log(
      `unflattened course prerequisite options for ${course.subjectCode} ${
        course.courseNumber
      }`
    );
    console.log(`
ALL
|--IMSE 317
|
+--EITHER
   |--ALL
   |  |--ECE 370
   |  +--MATH 276
   |
   |--ALL
   |  |--ECE 370
   |  +--ECE 276
   |
   +--ALL
      |--CIS 310
      +--EITHER
         |--CIS 350
         |--CIS 3501
         +--ISME 350
`);

    console.log(
      `flattend course prerequisite options for ${course.subjectCode} ${
        course.courseNumber
      }`
    );
    console.log("EITHER");
    console.log("|");
    for (const prerequisiteSet of prerequisitesFlattened) {
      const set = prerequisiteSet.map(
        course =>
          typeof course === "string"
            ? course
            : `${course.subjectCode} ${course.courseNumber}`
      );
      console.log(`|--ALL`);
      for (const course of set) {
        console.log(`|  |--${course}`);
      }
      console.log("|");
    }
  });

  it("prerequisiteDepth", () => {
    // course we want to find the preferred sequence
    const cis4962 = catalog.getCourse("CIS", "4962")!;

    // preferred courses to input into the algorithm
    const cis350 = catalog.getCourse("CIS", "350")!;
    const cis200 = catalog.getCourse("CIS", "200")!;
    const comp270 = catalog.getCourse("COMP", "270")!;

    const preferredCourses = Immutable.Set<string | Record.Course>()
      .add(cis350)
      .add(cis200)
      .add(comp270);
    const depth = cis4962.depth(catalog, preferredCourses);

    console.log(depth);
  });

  it("findPreferredCourses", () => {
    const cis375 = catalog.getCourse("CIS", "375")!;
    const cis350 = catalog.getCourse("CIS", "350")!;
    const cis200 = catalog.getCourse("CIS", "200")!;

    const preferredCourses = Immutable.Set<string | Record.Course>()
      .add(cis350)
      .add(cis200);

    const result = cis375.intersection(preferredCourses, catalog);
    console.log(result.count());
  });

  it("minDepth", () => {
    const math104 = catalog.getCourse("MATH", "104")!;

    expect(math104.minDepth(catalog)).toBe(1);
  });

  it("options", () => {
    const math115 = catalog.getCourse("MATH", "115")!;

    const options = math115.options(catalog);

    const optionsAsStrings = options.toArray().map(option => {
      return option
        .map(course => {
          if (typeof course === "string") {
            return course;
          }
          return course.simpleName;
        })
        .join(" ");
    });

    console.log(optionsAsStrings);
  });

  it("bestOption", () => {
    const math115 = catalog.getCourse("MATH", "115")!;

    const bestOption = math115.bestOption(
      catalog,
      Immutable.Set<string | Record.Course>()
    );

    expect(bestOption.first()).toBe("Mathematics Placement 115");
  });

  // it('preferredSequence', () => {
  //   // course we want to find the preferred sequence
  //   const cis4962 = catalog.getCourse('CIS', '4962')!;

  //   // preferred courses to input into the algorithm
  //   const cis350 = catalog.getCourse('CIS', '350')!;
  //   const cis200 = catalog.getCourse('CIS', '200')!;
  //   const comp270 = catalog.getCourse('COMP', '270')!;

  //   const preferredCourses = Immutable.Set<string | Record.Course>()
  //     .add(cis350)
  //     .add(cis200)
  //     .add(comp270);

  //   const preferredSequence = cis4962.bestOption(catalog, preferredCourses)!;

  //   function convertToString(set: Immutable.Set<string | Record.Course>) {
  //     const namesOfCourses: Array<any> = [];

  //     for (let course of set) {
  //       if (typeof course === 'string') {
  //         namesOfCourses.push(course);
  //       } else {
  //         const courseName = `${course.subjectCode} ${course.courseNumber}`;
  //         namesOfCourses.push(courseName);
  //         const subPreferredCourses = course.bestOption(catalog, preferredCourses);
  //         if (!subPreferredCourses) { continue; }
  //         namesOfCourses.push(convertToString(subPreferredCourses));
  //       }
  //     }

  //     return namesOfCourses;
  //   }

  //   console.log(JSON.stringify(convertToString(preferredSequence), null, 2));
  // });

  it("levels", () => {
    const cis4962 = catalog.getCourse("CIS", "4962")!;
    const cis350 = catalog.getCourse("CIS", "350")!;
    const cis200 = catalog.getCourse("CIS", "200")!;
    const comp270 = catalog.getCourse("COMP", "270")!;
    const comp105 = catalog.getCourse("COMP", "105")!;
    const math115 = catalog.getCourse("MATH", "115")!;

    const user = new Record.User()
      .addToDegree(cis4962)
      .addToDegree(cis350)
      .addToDegree(cis200)
      .addToDegree(comp270)
      .addToDegree(math115)
      .addToDegree(comp105);

    const levels = user.levels(catalog);

    for (const level of levels) {
      const levelString = level
        .map(
          course =>
            /*if*/ course instanceof Record.Course
              ? `${course.subjectCode} ${course.courseNumber}`
              : course
        )
        .join(" ");
      console.log(levelString);
      console.log("---");
    }
  });

  it("closure", () => {
    const cis350 = catalog.getCourse("CIS", "350")!;
    const cis200 = catalog.getCourse("CIS", "200")!;
    const comp270 = catalog.getCourse("COMP", "270")!;
    const comp105 = catalog.getCourse("COMP", "105")!;
    const math115 = catalog.getCourse("MATH", "115")!;

    const preferredCourses = Immutable.Set<string | Record.Course>()
      .add(cis350)
      .add(cis200)
      .add(comp270)
      .add(math115)
      .add(comp105);

    const closure = catalog
      .getCourse("CIS", "4962")!
      .closure(catalog, preferredCourses);

    console.log(
      closure
        .map(
          course =>
            /*if*/ course instanceof Record.Course
              ? `${course.subjectCode} ${course.courseNumber}`
              : course
        )
        .join(" ")
    );
  });

  // it('critical path', () => {
  //   const degree = Immutable.Set<string | Record.Course>()
  //     .add(catalog.getCourse('CIS', '4962')!)
  //     .add(catalog.getCourse('CIS', '200')!)
  //     .add(catalog.getCourse('COMP', '270')!)
  //     .add(catalog.getCourse('CIS', '450')!)
  //     .add(catalog.getCourse('CIS', '450')!)
  //     .add(catalog.getCourse('CHEM', '134')!)
  //     .add(catalog.getCourse('CHEM', '136')!)
  //     .add(catalog.getCourse('PHYS', '126')!)
  //     .add(catalog.getCourse('CIS', '421')!)
  //     .add(catalog.getCourse('CIS', '435')!)
  //     .add(catalog.getCourse('OB', '354')!)

  //   const user = new Record.User({
  //     degree,
  //   });

  //   const criticalPath = user.criticalPath(catalog);

  //   for (const tree of criticalPath) {
  //     for (const level of tree) {
  //       const levelString = level.map(course => /*if*/ course instanceof Record.Course
  //         ? `${course.subjectCode} ${course.courseNumber}`
  //         : course
  //       ).join(' ');
  //       console.log(levelString);
  //     }
  //     console.log('----');
  //   }
  // });
});
