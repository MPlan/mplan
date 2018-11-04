import * as Model from 'models';
import { Prerequisite } from './prerequisite';

interface PrerequisiteContainerProps {
  prerequisite: Model.Prerequisite.Model;
  disableLinks?: boolean | undefined;
}

const Container = Model.store.connect({
  mapStateToProps: (state, ownProps: PrerequisiteContainerProps) => ({
    prerequisite: ownProps.prerequisite,
    catalog: state.catalog,
    disableLinks: ownProps.disableLinks,
  }),
  mapDispatchToProps: () => ({}),
})(Prerequisite as any);

export { Container as Prerequisite };
