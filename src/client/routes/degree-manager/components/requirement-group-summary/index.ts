import * as Model from 'models';
import compose from 'recompose/compose';
import { withFalsyGuard } from 'components/with-falsy-guard';
import { history } from 'client/history';
import { NonFunctionProps, FunctionProps } from 'utilities/typings';

import { RequirementGroupSummary, RequirementGroupSummaryProps } from './requirement-group-summary';

interface RequirementGroupSummaryContainerProps {
  groupId: string;
  masteredDegreeId: string;
}

const Container = compose<RequirementGroupSummaryProps, RequirementGroupSummaryContainerProps>(
  Model.store.connect({
    mapStateToProps: (
      state,
      ownProps: RequirementGroupSummaryContainerProps,
    ): NonFunctionProps<RequirementGroupSummaryProps> | undefined => {
      const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
        state.masteredDegrees,
        ownProps.masteredDegreeId,
      );
      if (!masteredDegree) return undefined;

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
  }),
  withFalsyGuard(() => {
    history.replace('/degree-manager');
  }),
)(RequirementGroupSummary);

export { Container as RequirementGroupSummary };
