import * as Model from 'models';
import { Degree, DegreeProps } from './degree';

const scopeDefiner = (store: Model.App) => ({
  degree: store.user.degree,
  courseSearchResults: store.degreePage.searchResults,
  masteredDegrees: store.masteredDegrees,
  currentDegreeGroup: store.degreePage.currentDegreeGroup,
});

const container = Model.store.connect(Degree)({
  scopeDefiner,
  mapScopeToProps: ({ scope: _scope, sendUpdate, ownProps }) => {
    const scope = _scope as ReturnType<typeof scopeDefiner>;
    return {
      degree: scope.degree,
      courseSearchResults: scope.courseSearchResults,
      masteredDegrees: scope.masteredDegrees
        .valueSeq()
        .sortBy(degree => degree.name)
        .toArray(),
      currentDegreeGroup: scope.currentDegreeGroup,

      onAddCourseClick: degreeGroup => {
        sendUpdate(store => store.degreePage.setCurrentDegreeGroup(degreeGroup).updateStore(store));
      },

      onDegreeGroupDelete: degreeGroup => {
        sendUpdate(store => store.user.degree.deleteDegreeGroup(degreeGroup).updateStore(store));
      },

      onDegreeGroupNameChange: (degreeGroup, newName) => {
        sendUpdate(store =>
          store.user.degree
            .updateDegreeGroup(degreeGroup, degreeGroup => degreeGroup.set('name', newName))
            .updateStore(store),
        );
      },

      onDeleteCourse: (degreeGroup, course) => {
        sendUpdate(store =>
          store.user.degree
            .updateDegreeGroup(degreeGroup, degreeGroup => degreeGroup.deleteCourse(course))
            .updateStore(store),
        );
      },

      onAddCourseModalClose: () => {
        sendUpdate(store =>
          store.degreePage
            .clearSearch()
            .set('currentDegreeGroup', undefined)
            .updateStore(store),
        );
      },

      onAddDegreeGroup: () => {
        sendUpdate(store => store.user.degree.addNewDegreeGroup().updateStore(store));
      },

      onChangeMajor: majorId => {
        sendUpdate(store => {
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

      onDegreeGroupAddCourse: (degreeGroup, course) => {
        sendUpdate(store =>
          store.user.degree
            .updateDegreeGroup(degreeGroup, degreeGroup => degreeGroup.addCourse(course))
            .updateStore(store),
        );
      },

      onSearchCourse: query => {
        sendUpdate(store => store.degreePage.search(query).updateStore(store));
      },
    };
  },
});

export { container as Degree };
