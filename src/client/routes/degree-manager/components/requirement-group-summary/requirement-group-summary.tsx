import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
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
  onBackClick: () => void;
}

export class RequirementGroupSummary extends React.PureComponent<RequirementGroupSummaryProps, {}> {
  render() {
    const { group, onBackClick } = this.props;
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
                <strong>Course validation</strong>
              </Paragraph>
              <Paragraph>TODO</Paragraph>
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
