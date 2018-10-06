import * as Model from 'models';
import { history } from 'client/history';
import { NonFunctionProps, FunctionProps } from 'utilities/typings';

import { RequirementGroupSummary, RequirementGroupSummaryProps } from './requirement-group-summary';

interface RequirementGroupSummaryContainerProps {
  groupId: string;
  masteredDegreeId: string;
}

const Container = Model.store.connect({
  mapStateToProps: (
    state,
    ownProps: RequirementGroupSummaryContainerProps,
  ): NonFunctionProps<RequirementGroupSummaryProps> | undefined => {
    const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
      state.masteredDegrees,
      ownProps.masteredDegreeId,
    );
    if (!masteredDegree) return undefined;

    if (!ownProps.groupId) return undefined;
    const group = Model.MasteredDegree.getGroup(masteredDegree, ownProps.groupId);
    if (!group) return undefined;

    return { group };
  },
  mapDispatchToProps: (
    _,
    ownProps: RequirementGroupSummaryContainerProps,
  ): FunctionProps<RequirementGroupSummaryProps> => ({
    onBackClick: () => {
      history.push(`/degree-manager/${ownProps.masteredDegreeId}`);
    },
  }),
})(RequirementGroupSummary);

export { Container as RequirementGroupSummary };
