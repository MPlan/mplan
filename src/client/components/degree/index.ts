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
    };
  },
  mapDispatchToProps: () => ({}),
})(Degree);

export { Container as Degree };
