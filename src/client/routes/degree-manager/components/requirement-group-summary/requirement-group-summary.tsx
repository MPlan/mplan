import * as React from 'react';
import * as Model from 'models';

interface RequirementGroupSummaryProps {
  group: Model.RequirementGroup.Model;
}

export class RequirementGroupSummary extends React.PureComponent<
  RequirementGroupSummaryProps,
  {}
> {}
