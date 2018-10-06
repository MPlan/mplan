import * as Model from 'models';
import compose from 'recompose/compose';
import { withFalsyGuard } from 'components/with-falsy-guard';
import { history } from 'client/history';

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
    ): RequirementGroupSummaryProps | undefined => {
      const masteredDegree = Model.MasteredDegrees.getMasteredDegree(
        state.masteredDegrees,
        ownProps.masteredDegreeId,
      );
      if (!masteredDegree) return undefined;

      const group = Model.MasteredDegree.getGroup(masteredDegree, ownProps.groupId);
      if (!group) return undefined;

      return {
        group,
      };
    },
    mapDispatchToProps: dispatch => ({}),
  }),
  withFalsyGuard(() => {
    history.replace('/degree-manager');
  }),
)(RequirementGroupSummary);

export { Container as RequirementGroupSummary };
