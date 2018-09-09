import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Paragraph } from 'components/paragraph';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { DegreeItem } from './degree-item';
import { DescriptionAction } from './description-action';
import { Fa as _Fa } from 'components/fa';

const ActionSubtitle = styled(Text)`
  text-transform: uppercase;
  font-size: ${styles.space(-1)};
  margin-top: ${styles.space(-1)};
`;
const Fa = styled(_Fa)`
  margin-left: ${styles.space(-1)};
`;

interface DegreeSummaryProps {}

export class DegreeSummary extends React.PureComponent<DegreeSummaryProps, {}> {
  render() {
    return (
      <DegreeItem title="Summary">
        <DescriptionAction
          description={
            <>
              <Paragraph>Current Status: Unpublished</Paragraph>
              <Paragraph>Degree group count: 10</Paragraph>
              <Paragraph>Total credits allowed: 120</Paragraph>
              <Paragraph>Maximum credits: 120</Paragraph>
              <Paragraph>Maximum credits: 120</Paragraph>
            </>
          }
        >
          <PrimaryButton>
            Preview Degree <Fa icon="angleRight" />
          </PrimaryButton>
          <ActionSubtitle>Your changes save automatically.</ActionSubtitle>
        </DescriptionAction>
      </DegreeItem>
    );
  }
}
