import * as Model from 'models';
import { Degree } from './degree';
import { CourseModel } from './components/requirement-group';

const Container = Model.store.connect({
  mapStateToProps: state => {
    const user = state.user || Model.User.emptyUser;
    const { degree } = user;
    const { masteredDegrees } = state;

    const degreeName = Model.Degree.getDegreeName(degree, masteredDegrees);

    return {
      degreeName,
      currentCredits: 90,
      totalCredits: 120,
      columnOne: [
        {
          id: 'some-group',
          name: 'Writing and Oral Communication',
          courses: [
            {
              id: 'some-course',
              name: 'Writing and Rhetoric I',
              completed: true,
              creditHours: 3,
              catalogLink: '/catalog/AAAS/340',
            },

            {
              id: 'some-cours3e',
              name: 'Writing and Rhetoric II',
              completed: false,
              creditHours: 3,
              catalogLink: '/catalog/AAAS/340',
            },
          ] as CourseModel[],
        },
        {
          id: 'some-group',
          name: 'Writing and Oral Communication',
          courses: [
            {
              id: 'sosme-course',
              name: 'Writing and Rhetoric I',
              completed: true,
              creditHours: 3,
              catalogLink: '/catalog/AAAS/340',
            },

            {
              id: 'somse-cours3e',
              name: 'Writing and Rhetoric II',
              completed: false,
              creditHours: 3,
              catalogLink: '/catalog/AAAS/340',
            },
            {
              id: 'somse-coufdsfdsrs3e',
              name: 'Writing and Rhetoric III',
              completed: false,
              creditHours: 3,
              catalogLink: '/catalog/AAAS/340',
            },
          ] as CourseModel[],
        },
      ],
      columnTwo: [
        {
          id: 'some-group',
          name: 'Writing and Oral Communication',
          courses: [
            {
              id: 'some-coufrse',
              name: 'Writing and Rhetoric I',
              completed: true,
              creditHours: 3,
              catalogLink: '/catalog/AAAS/340',
            },

            {
              id: 'some-codsurs3e',
              name: 'Writing and Rhetoric II',
              completed: false,
              creditHours: 3,
              catalogLink: '/catalog/AAAS/340',
            },
          ] as CourseModel[],
        },
      ],
      columnThree: [
        {
          id: 'some-group',
          name: 'Writing and Oral Communication',
          courses: [
            {
              id: 'some-coufrse',
              name: 'Writing and Rhetoric I',
              completed: true,
              creditHours: 3,
              catalogLink: '/catalog/AAAS/340',
            },

            {
              id: 'some-codsurs3e',
              name: 'Writing and Rhetoric II',
              completed: false,
              creditHours: 3,
              catalogLink: '/catalog/AAAS/340',
            },
          ] as CourseModel[],
        },
      ],
    };
  },
  mapDispatchToProps: () => ({
    onToggleCourseComplete: (groupId: string, courseId: string) => {},
    onRemoveCourse: (groupId: string, courseId: string) => {},
  }),
})(Degree);

export { Container as Degree };
