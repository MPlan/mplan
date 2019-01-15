import * as Model from 'models';
import { memoizeLast } from 'utilities/memoize-last';
import { Welcome } from './welcome';
import { isEqual } from 'lodash';
import { filter, map, distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { saveUser } from 'client/fetch/user';
import { Observable } from 'rxjs';

const getMasteredDegreesConsideringAdmin = memoizeLast(
  (degrees: Model.MasteredDegrees.Model, isAdmin: boolean) => {
    const degreeArray = Model.MasteredDegrees.getAsArray(degrees);
    if (isAdmin) return degreeArray;

    return degreeArray.filter(degree => degree.published);
  },
);

const Container = Model.store.connect({
  mapStateToProps: state => {
    const isAdmin = state.user ? state.user.isAdmin : false;
    return {
      degrees: getMasteredDegreesConsideringAdmin(state.masteredDegrees, isAdmin),
    };
  },
  mapDispatchToProps: dispatch => ({
    onSelectedDegree: (degreeId: string) => {
      dispatch(state => {
        const user = state.user;
        if (!user) return state;

        return {
          ...state,
          user: {
            ...user,
            chosenDegree: true,
            degree: {
              ...user.degree,
              masteredDegreeId: degreeId,
            },
          },
        };
      });
    },
  }),
})(Welcome);

const user$ = Model.store.stream().pipe(
  filter(store => !!store.user),
  map(store => store.user!),
  distinctUntilChanged(isEqual),
  debounceTime(1000),
) as Observable<Model.User.Model>;
user$.subscribe(saveUser);

export { Container as Welcome };
