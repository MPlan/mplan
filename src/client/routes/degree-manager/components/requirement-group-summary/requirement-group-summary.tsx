import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import * as pluralize from 'pluralize';
import styled from 'styled-components';

import { Paragraph } from 'components/paragraph';
import { Text } from 'components/text';
import { PrimaryButton } from 'components/button';
import { Fa as _Fa } from 'components/fa';
import { HorizontalLine } from 'components/horizontal-line';

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
  group: Model.RequirementGroup.Model | undefined;
  minimumPrepopulatedCredits: number;
  maximumPrepopulatedCredits: number;
  onBackClick: () => void;
}

export class RequirementGroupSummary extends React.PureComponent<RequirementGroupSummaryProps, {}> {
  render() {
    const {
      group,
      onBackClick,
      minimumPrepopulatedCredits,
      maximumPrepopulatedCredits,
    } = this.props;
    if (!group) return null;

    return (
      <DegreeItem title="Review">
        <DescriptionAction
          description={
            <>
              <Text>
                <strong>Description</strong>
              </Text>
              <Text small dangerouslySetInnerHTML={{ __html: group.descriptionHtml }} />
              <HorizontalLine />

              <Paragraph>
                <strong>Credit hours</strong>
              </Paragraph>
              {group.creditMinimum > group.creditMaximum && (
                <Paragraph color={styles.danger}>
                  The credit minimum exceeds the credit maximum. This may lead to undesired
                  behavior.
                </Paragraph>
              )}
              <Paragraph>
                {group.creditMinimum === group.creditMaximum ? (
                  <>
                    Students must add enough courses to total exactly{' '}
                    <strong>{group.creditMinimum}</strong> credits hours.
                  </>
                ) : (
                  <>
                    Students must add enough courses to total at least{' '}
                    <strong>{group.creditMinimum}</strong> credit hours but no more than{' '}
                    <strong>{group.creditMaximum}</strong>.
                  </>
                )}
              </Paragraph>
              <Paragraph>
                If a student does not meet these requirements, they will receive a non-dismissable
                warning.
              </Paragraph>
              <HorizontalLine />

              <Paragraph>
                <strong>Courses</strong>
              </Paragraph>
              <Paragraph>
                Mode:{' '}
                <strong>
                  {group.courseMode === 'relaxed'
                    ? 'relaxed'
                    : group.courseMode === 'strict'
                      ? 'strict'
                      : group.courseMode === 'alternates-allowed'
                        ? 'alternates allowed'
                        : 'ERROR'}
                </strong>
              </Paragraph>
              {group.courseMode === 'relaxed' ? (
                <>
                  <Paragraph>
                    In relax mode, students can freely add courses to this list.
                    <br />
                    No further action needed.
                  </Paragraph>
                </>
              ) : (
                <>
                  <Paragraph>
                    There {group.courses.length > 0 ? 'are' : 'is'}{' '}
                    <strong>{group.courses.length}</strong> configured course
                    {group.courses.length > 0 ? 's' : ''} in this group.
                    <br />
                    {group.courseMode === 'strict' && (
                      <>
                        {minimumPrepopulatedCredits === maximumPrepopulatedCredits ? (
                          <>
                            These courses total to <strong>{minimumPrepopulatedCredits}</strong>{' '}
                            credit {pluralize('hours', minimumPrepopulatedCredits)}.
                          </>
                        ) : (
                          <>
                            These courses total to <strong>{minimumPrepopulatedCredits}</strong> -{' '}
                            <strong>{maximumPrepopulatedCredits}</strong> credit hours.
                          </>
                        )}
                      </>
                    )}
                    {group.courseMode === 'alternates-allowed' && (
                      <>
                        {minimumPrepopulatedCredits === maximumPrepopulatedCredits ? (
                          <>
                            The courses added by default total to{' '}
                            <strong>{minimumPrepopulatedCredits}</strong> credit{' '}
                            {pluralize('hours', minimumPrepopulatedCredits)}.
                          </>
                        ) : (
                          <>
                            The courses added by default total to{' '}
                            <strong>{minimumPrepopulatedCredits}</strong> -{' '}
                            <strong>{maximumPrepopulatedCredits}</strong> credit hours.
                          </>
                        )}
                      </>
                    )}
                  </Paragraph>
                  <Paragraph color={styles.danger}>
                    {maximumPrepopulatedCredits < group.creditMinimum && (
                      <>
                        The maximum total of prepopulated credit hours (
                        <strong>{maximumPrepopulatedCredits}</strong>) is less than the minimum for
                        this group (<strong>{group.creditMinimum}</strong>
                        ).
                      </>
                    )}
                    {minimumPrepopulatedCredits > group.creditMaximum && (
                      <>
                        The minimum total of prepopulated credit hours (
                        <strong>{minimumPrepopulatedCredits}</strong>) is greater than the maximum
                        for this group (<strong>{group.creditMaximum}</strong>
                        ).
                      </>
                    )}
                  </Paragraph>
                </>
              )}
            </>
          }
        >
          <PrimaryButton onClick={onBackClick}>
            <Fa icon="angleLeft" />
            Back to degree
          </PrimaryButton>
          <ActionSubtitle>Your changes save automatically.</ActionSubtitle>
        </DescriptionAction>
      </DegreeItem>
    );
  }
}
