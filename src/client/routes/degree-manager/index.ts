import * as Model from 'models';
import { ObjectId } from 'utilities/object-id';
import { DegreeEditor } from './degree-manager';
import { saveMasteredDegree } from 'client/fetch/mastered-degrees';
import { history } from 'client/history';
import { map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { isEqual } from 'lodash';

const Container = Model.store.connect({
  mapStateToProps: state => ({
    locationPathname: history.location.pathname,
    masteredDegrees: Model.MasteredDegrees.getAsArray(state.masteredDegrees),
  }),
  mapDispatchToProps: dispatch => ({
    onCreateDegree: (degreeName: string) => {
      dispatch(state => {
        const newDegreeId = ObjectId();
        const lastPosition = Model.MasteredDegrees.getLastPosition(state.masteredDegrees);
        const newDegree = Model.MasteredDegree.createNewMasteredDegree(
          degreeName,
          lastPosition,
          newDegreeId,
        );

        setTimeout(() => {
          // TODO: this is kind of a hack
          history.push(`/degree-manager/${newDegreeId}`);
        }, 100);

        return {
          ...state,
          masteredDegrees: Model.MasteredDegrees.addMasteredDegree(
            state.masteredDegrees,
            newDegree,
          ),
        };
      });
    },
    onMasteredDegreeClick: (masteredDegreeId: string) => {
      history.push(`/degree-manager/${masteredDegreeId}`);
    },
  }),
})(DegreeEditor);

const masteredDegrees$ = Model.store.stream().pipe(
  map(state => ({
    masteredDegrees: state.masteredDegrees,
    watchedMasteredDegrees: state.watchedMasteredDegrees,
  })),
  map(({ masteredDegrees, watchedMasteredDegrees }) => {
    const degrees = Object.entries(masteredDegrees)
      .filter(([masteredDegreeId]) => watchedMasteredDegrees[masteredDegreeId])
      .map(([_, value]) => value);
    return degrees;
  }),
  distinctUntilChanged(isEqual),
  debounceTime(1000),
);

masteredDegrees$.subscribe(changedMasteredDegrees =>
  changedMasteredDegrees.forEach(saveMasteredDegree),
);

export { Container as DegreeEditor };
