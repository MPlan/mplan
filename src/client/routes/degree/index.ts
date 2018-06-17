import * as Model from 'models';
import { Degree, DegreeProps } from './degree';

const scopeDefiner = (store: Model.App) => ({
  degree: store.user.degree,
  courseSearchResults: store.degreePage.searchResults,
  masteredDegrees: store.masteredDegrees,
  currentDegreeGroup: store.degreePage.currentDegreeGroup,
});

const container = Model.store.connect({
  scopeTo: store => store,
  mapStateToProps: (scope: Model.App) => {
    return {
      degree: scope.user.degree,
      courseSearchResults: scope.degreePage.searchResults,
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
            degreeGroup.set('name', newName),
          );
          return Model.Degree.updateStore(store, next);
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
                  name: masteredDegreeGroup.name,
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

      onSearchCourse: (query: string) => {
        dispatch(store => {
          const next = store.degreePage.search(query);
          return Model.DegreePage.updateStore(store, next);
        });
      },
    };
  },
})(Degree);

export { container as Degree };
