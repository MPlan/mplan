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
        dispatch(store => store.degreePage.setCurrentDegreeGroup(degreeGroup).updateStore(store));
      },

      onDegreeGroupDelete: (degreeGroup: Model.DegreeGroup) => {
        dispatch(store => store.user.degree.deleteDegreeGroup(degreeGroup).updateStore(store));
      },

      onDegreeGroupNameChange: (degreeGroup: Model.DegreeGroup, newName: string) => {
        dispatch(store =>
          store.user.degree
            .updateDegreeGroup(degreeGroup, degreeGroup => degreeGroup.set('name', newName))
            .updateStore(store),
        );
      },

      onDeleteCourse: (degreeGroup: Model.DegreeGroup, course: string | Model.Course) => {
        dispatch(store =>
          store.user.degree
            .updateDegreeGroup(degreeGroup, degreeGroup => degreeGroup.deleteCourse(course))
            .updateStore(store),
        );
      },

      onAddCourseModalClose: () => {
        dispatch(store =>
          store.degreePage
            .clearSearch()
            .set('currentDegreeGroup', undefined)
            .updateStore(store),
        );
      },

      onAddDegreeGroup: () => {
        dispatch(store => store.user.degree.addNewDegreeGroup().updateStore(store));
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
        dispatch(store =>
          store.user.degree
            .updateDegreeGroup(degreeGroup, degreeGroup => degreeGroup.addCourse(course))
            .updateStore(store),
        );
      },

      onSearchCourse: (query: string) => {
        dispatch(store => store.degreePage.search(query).updateStore(store));
      },
    };
  },
})(Degree);

export { container as Degree };
