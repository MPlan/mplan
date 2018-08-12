import * as Model from './';
import { Course } from './course';

describe('Course', () => {
  it('considers prerequisites that can be taken concurrently', () => {
    const cis150 = new Course({
      _id: Model.ObjectId(),
      subjectCode: 'CIS',
      courseNumber: '150',
      prerequisites: ['MATH', '115', 'CONCURRENT'],
    });

    const math115 = new Course({
      _id: Model.ObjectId(),
      subjectCode: 'MATH',
      courseNumber: '115',
    });

    Model.store.sendUpdate(
      () => new Model.App({ catalog: new Model.Catalog().addCourse(cis150).addCourse(math115) }),
    );

    expect(math115.depth()).toBe(1);
    expect(cis150.depth()).toBe(2);
  });
});
