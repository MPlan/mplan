import * as Model from 'models';
import { Welcome } from './welcome';

const Container = Model.store.connect({
  mapStateToProps: state => {
    return {
      degrees: Model.MasteredDegrees.getAsArray(state.masteredDegrees),
    };
  },
  mapDispatchToProps: () => ({}),
})(Welcome);

export { Container as Welcome };
