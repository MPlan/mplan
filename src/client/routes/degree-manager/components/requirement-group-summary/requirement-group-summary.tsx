import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { Fa as _Fa } from 'components/fa';

import { DegreeItem } from 'routes/degree-manager/components/degree-item';
import { DescriptionAction } from 'routes/degree-manager/components/description-action';

const Fa = styled(_Fa)`
  margin-right: ${styles.space(-1)};
`;
const ActionSubtitle = styled(Text)`
  text-transform: uppercase;
  font-size: ${styles.space(-1)};
  margin-top: ${styles.space(-1)};
`;

export interface RequirementGroupSummaryProps {
  group: Model.RequirementGroup.Model;
}

export class RequirementGroupSummary extends React.PureComponent<RequirementGroupSummaryProps, {}> {
  render() {
    return (
      <DegreeItem title="Summary">
        <DescriptionAction description={<Text>test</Text>}>
          <PrimaryButton>
            <Fa icon="angleLeft" />
            Back to degree
          </PrimaryButton>
          <ActionSubtitle>Your changes save automatically.</ActionSubtitle>
        </DescriptionAction>
      </DegreeItem>
    );
  }
}
