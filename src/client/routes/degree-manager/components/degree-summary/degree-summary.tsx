import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import * as pluralize from 'pluralize';
import styled from 'styled-components';

import { Paragraph } from 'components/paragraph';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { Fa as _Fa } from 'components/fa';

import { DegreeItem } from 'routes/degree-manager/components/degree-item';
import { DescriptionAction } from 'routes/degree-manager/components/description-action';

const ActionSubtitle = styled(Text)`
  text-transform: uppercase;
  font-size: ${styles.space(-1)};
  margin-top: ${styles.space(-1)};
`;
const Fa = styled(_Fa)`
  margin-left: ${styles.space(-1)};
`;
const HorizontalLine = styled.hr`
  width: 100%;
  border: none;
  border-bottom: 1px solid ${styles.grayLighter};
`;

interface DegreeSummaryProps {
  degree: Model.MasteredDegree.Model | undefined;
}

export class DegreeSummary extends React.PureComponent<DegreeSummaryProps, {}> {
  get minimumTotal() {
    if (!this.props.degree) return 0;

    return Object.values(this.props.degree.requirementGroups)
      .map(group => group.creditMinimum)
      .reduce((sum, next) => sum + next, 0);
  }
  get maximumTotal() {
    if (!this.props.degree) return 0;

    return Object.values(this.props.degree.requirementGroups)
      .map(group => group.creditMaximum)
      .reduce((sum, next) => sum + next, 0);
  }
  get groupGrount() {
    if (!this.props.degree) return 0;
    return Object.keys(this.props.degree.requirementGroups).length;
  }

  render() {
    const { degree } = this.props;
    if (!degree) return null;

    return (
      <DegreeItem title="Review">
        <DescriptionAction
          description={
            <>
              <Paragraph>
                <strong>Publish state</strong>
              </Paragraph>
              <Paragraph>
                Current status: <strong>{degree.published ? 'Published' : 'Unlisted'}</strong>
              </Paragraph>
              <Paragraph>
                {degree.published ? (
                  <>This degree is viewable by all students.</>
                ) : (
                  <>
                    This degree is hidden from new students but student who previously selected the
                    degree will still have access to it.
                  </>
                )}
              </Paragraph>
              <HorizontalLine />

              <Paragraph>
                <strong>Credit hours and requirement groups</strong>
              </Paragraph>
              <Paragraph>
                Students must add enough courses to total at least{' '}
                <strong>{degree.minimumCredits}</strong> credit{' '}
                {pluralize('hours', degree.minimumCredits)}. If a student does not meet these
                requirements, they will receive a non-dismissable warning.
              </Paragraph>
              <Paragraph>
                There {this.groupGrount === 1 ? 'is' : 'are'} currently{' '}
                <strong>{this.groupGrount}</strong> requirement{' '}
                {pluralize('groups', Object.keys(degree.requirementGroups).length)} that total
                {this.groupGrount === 1 ? 's' : ''} up to a minimum of{' '}
                <strong>{this.minimumTotal}</strong> credit {pluralize('hours', this.minimumTotal)}{' '}
                and a maximum of <strong>{this.maximumTotal}</strong> credit{' '}
                {pluralize('hours', this.maximumTotal)}.
              </Paragraph>
              {this.maximumTotal < degree.minimumCredits && (
                <Paragraph color={styles.danger}>
                  The maximum credit total ({this.maximumTotal}) do not meet the number of minimum
                  credits ({degree.minimumCredits}
                  ). Students will not be able to meet the requirements for this degree.
                </Paragraph>
              )}
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
