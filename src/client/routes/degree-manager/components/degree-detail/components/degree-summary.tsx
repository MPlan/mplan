import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Paragraph } from 'components/paragraph';
import { PrimaryButton } from 'components/button';
import { DegreeItem } from './degree-item';
import { DescriptionAction } from './description-action';

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
          <PrimaryButton>Preview Degree</PrimaryButton>
        </DescriptionAction>
      </DegreeItem>
    );
  }
}
