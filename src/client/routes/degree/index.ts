import * as Model from 'models';
import { Degree, DegreeProps } from './degree';

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (scope: Model.App) => {
    return {
      degree: scope.user.degree,
      masteredDegrees: scope.masteredDegrees
        .valueSeq()
        .sortBy(degree => degree.name)
        .toArray(),
      currentDegreeGroup: scope.degreePage.currentDegreeGroup,
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onAddCourseClick: (degreeGroup: Model.DegreeGroup) => {
        dispatch(store => {
          const next = store.degreePage.setCurrentDegreeGroup(degreeGroup);
          return Model.DegreePage.updateStore(store, next);
        });
      },

      onDegreeGroupDelete: (degreeGroup: Model.DegreeGroup) => {
        dispatch(store => {
          const next = store.user.degree.deleteDegreeGroup(degreeGroup);
          return Model.Degree.updateStore(store, next);
        });
      },

      onDegreeGroupNameChange: (degreeGroup: Model.DegreeGroup, newName: string) => {
        dispatch(store => {
          const next = store.user.degree.updateDegreeGroup(degreeGroup, degreeGroup =>
            degreeGroup.set('customName', newName),
          );
          return Model.Degree.updateStore(store, next);
        });
      },

      onDegreeGroupCoursesChange: (degreeGroup: Model.DegreeGroup, newCourses: Model.Course[]) => {
        dispatch(store => {
          const currentCourses = degreeGroup.courses().toArray();

          const currentCourseLookup = currentCourses.reduce(
            (acc, next) => {
              acc[next.id] = true;
              return acc;
            },
            {} as { [id: string]: true },
          );
          const nextCourseLookup = newCourses.reduce(
            (acc, next) => {
              acc[next.id] = true;
              return acc;
            },
            {} as { [id: string]: true },
          );

          const coursesToAdd = newCourses.reduce(
            (acc, next) => {
              if (!currentCourseLookup[next.id]) acc.push(next);
              return acc;
            },
            [] as Model.Course[],
          );
          const coursesToDelete = currentCourses.reduce(
            (acc, next) => {
              if (!nextCourseLookup[next.id]) acc.push(next);
              return acc;
            },
            [] as Model.Course[],
          );

          const degreeGroupWithNewCourses = coursesToAdd.reduce(
            (degreeGroup, next) => degreeGroup.addCourse(next),
            degreeGroup,
          );
          const nextDegreeGroup = coursesToDelete.reduce(
            (degreeGroup, next) => degreeGroup.deleteCourse(next),
            degreeGroupWithNewCourses,
          );

          return Model.DegreeGroup.updateStore(store, nextDegreeGroup);
        });
      },

      onDeleteCourse: (degreeGroup: Model.DegreeGroup, course: string | Model.Course) => {
        dispatch(store => {
          const next = store.user.degree.updateDegreeGroup(degreeGroup, degreeGroup =>
            degreeGroup.deleteCourse(course),
          );
          return Model.Degree.updateStore(store, next);
        });
      },

      onAddCourseModalClose: () => {
        dispatch(store => {
          const next = store.degreePage.clearSearch().set('currentDegreeGroup', undefined);
          return Model.DegreePage.updateStore(store, next);
        });
      },

      onAddDegreeGroup: () => {
        dispatch(store => {
          const next = store.user.degree.addNewDegreeGroup();
          return Model.Degree.updateStore(store, next);
        });
      },

      onChangeMajor: (majorId: string) => {
        dispatch(store => {
          const major = store.masteredDegrees.get(majorId);
          if (!major) {
            console.warn('could not find major');
            return store;
          }
          const newStore = store.updateDegree(degree => {
            const clearedDegree = degree.update('degreeGroups', groups => groups.clear());
            const newDegree = major.masteredDegreeGroups.reduce((degree, masteredDegreeGroup) => {
              return degree.set('masteredDegreeId', majorId).addDegreeGroup(
                new Model.DegreeGroup({
                  _id: Model.ObjectId(),
                  customName: 'Pre-made Group',
                  masteredDegreeGroupId: masteredDegreeGroup.id,
                  _courseIds: masteredDegreeGroup.defaultIds,
                }),
              );
            }, clearedDegree);
            return newDegree;
          });
          return newStore;
        });
      },

      onDegreeGroupAddCourse: (degreeGroup: Model.DegreeGroup, course: string | Model.Course) => {
        dispatch(store => {
          const next = store.user.degree.updateDegreeGroup(degreeGroup, degreeGroup =>
            degreeGroup.addCourse(course),
          );

          return Model.Degree.updateStore(store, next);
        });
      },

      onCourseCompletedToggle: (degreeGroup: Model.DegreeGroup, course: string | Model.Course) => {
        dispatch(store => {
          const next = degreeGroup.toggleCourseCompletion(course);
          return Model.DegreeGroup.updateStore(store, next);
        })
      }
    };
  },
})(Degree);

export { container as Degree };
