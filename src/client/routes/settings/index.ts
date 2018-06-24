import * as Model from 'models';
import { Settings } from './settings';
const container = Model.store.connect({
  scopeTo: store => store.user,
  mapDispatchToProps: () => {
    return {};
  },
  mapStateToProps: (user: Model.User) => {
    return {
      registerDate: user.registerDate,
      lastLoginDate: user.lastLoginDate,
      lastUpdateDate: user.lastUpdateDate,
      degreeName: user.degree.name,
    };
  },
})(Settings);

export { container as Settings };
