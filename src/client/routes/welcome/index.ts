import * as Model from 'models';
import { memoizeLast } from 'utilities/memoize-last';
import { Welcome } from './welcome';

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
  mapDispatchToProps: () => ({}),
})(Welcome);

export { Container as Welcome };
