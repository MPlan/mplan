import * as Model from 'models';
import { Settings } from './settings';
import { history } from '../../app';
const container = Model.store.connect({
  scopeTo: store => store.user,
  mapStateToProps: (user: Model.User) => {
    return {
      registerDate: user.registerDate,
      lastLoginDate: user.lastLoginDate,
      lastUpdateDate: user.lastUpdateDate,
      degreeName: user.degree.name,
    };
  },
  mapDispatchToProps: dispatch => {
    return {
      onResetDegree: () => {
        dispatch(store => {
          const next = store.user.resetDegree();
          return Model.User.updateStore(store, next);
        });
        history.push('/degree');
      },
    };
  },
})(Settings);

export { container as Settings };