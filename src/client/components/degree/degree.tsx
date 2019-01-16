import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { Page } from 'components/page';
import { Text } from 'components/text';
import { View } from 'components/view';
import { PrimaryButton } from 'components/button';

const { round } = Math;

const TitleLeft = styled(View)`
  flex-direction: row;
  align-items: flex-end;
`;
const Status = styled(View)``;
const PercentageRow = styled(View)`
  flex-direction: row;
  /* margin-bottom: ${styles.space(-1)}; */
  align-items: baseline;
`;
const Percentage = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: bold;
  margin-right: ${styles.space(-1)};
  min-width: 6rem;
`;
const CompleteText = styled(Text)`
  font-size: ${styles.space(1)};
`;
const CreditsRow = styled(View)`
  flex-direction: row;
  align-items: baseline;
`;
const Credits = styled(Text)`
  font-size: ${styles.space(1)};
  margin-right: ${styles.space(-1)};
  min-width: 6rem;
`;
const CreditsText = styled(Text)``;
const TutorialButton = styled(PrimaryButton)`
  margin-right: ${styles.space(0)};
`;

interface DegreeProps {
  degreeName: string;
  currentCredits: number;
  totalCredits: number;
}
interface DegreeState {}

export class Degree extends React.PureComponent<DegreeProps, DegreeState> {
  render() {
    const { degreeName, currentCredits, totalCredits } = this.props;

    const percentage = (currentCredits * 100) / totalCredits;

    return (
      <Page
        title={degreeName}
        titleLeft={
          <TitleLeft>
            <Status>
              <PercentageRow>
                <Percentage>{isNaN(percentage) ? '0' : round(percentage)}%</Percentage>
                <CompleteText>complete</CompleteText>
              </PercentageRow>
              <CreditsRow>
                <Credits>
                  {currentCredits}/{totalCredits}
                </Credits>
                <CreditsText>credits</CreditsText>
              </CreditsRow>
            </Status>
          </TitleLeft>
        }
      >
        <Text>Test degree</Text>
      </Page>
    );
  }
}
