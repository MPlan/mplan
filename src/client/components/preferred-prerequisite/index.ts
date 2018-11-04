import * as Model from 'models';

import { PreferredPrerequisite } from './preferred-prerequisite';

interface PreferredPrerequisiteContainerProps {
  course: Model.Course.Model;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: PreferredPrerequisiteContainerProps) => {
    const user = state.user;
    if (!user) throw new Error('no user found');

    return {
      bestOption: Model.Course.getBestOption(ownProps.course, user.degree, state.catalog),
    };
  },
  mapDispatchToProps: () => ({}),
})(PreferredPrerequisite);

export { Container as PreferredPrerequisite };
