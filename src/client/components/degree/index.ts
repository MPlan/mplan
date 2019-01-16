import * as Model from 'models';
import { Degree } from './degree';

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
            },

            {
              id: 'some-cours3e',
              name: 'Writing and Rhetoric II',
              completed: false,
              creditHours: 3,
            },
          ],
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
            },

            {
              id: 'somse-cours3e',
              name: 'Writing and Rhetoric II',
              completed: false,
              creditHours: 3,
            },
            {
              id: 'somse-coufdsfdsrs3e',
              name: 'Writing and Rhetoric III',
              completed: false,
              creditHours: 3,
            },
          ],
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
            },

            {
              id: 'some-codsurs3e',
              name: 'Writing and Rhetoric II',
              completed: false,
              creditHours: 3,
            },
          ],
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
            },

            {
              id: 'some-codsurs3e',
              name: 'Writing and Rhetoric II',
              completed: false,
              creditHours: 3,
            },
          ],
        },
      ],
    };
  },
  mapDispatchToProps: () => ({}),
})(Degree);

export { Container as Degree };
