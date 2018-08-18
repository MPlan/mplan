import * as Model from 'models';

import { Prerequisite } from './prerequisite';

interface PrerequisiteContainerProps {
  prerequisite: Model.Prerequisite;
}

const container = Model.store.connect({
  scopeTo: store => store.catalog,
  mapStateToProps: (catalog: Model.Catalog, ownProps: PrerequisiteContainerProps) => ({
    catalog,
    ...ownProps,
  }),
  mapDispatchToProps: () => ({}),
})(Prerequisite);

export { container as Prerequisite };
