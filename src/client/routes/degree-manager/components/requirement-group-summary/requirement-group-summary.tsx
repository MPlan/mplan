import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { Paragraph } from 'components/paragraph';
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
const HorizontalLine = styled.hr`
  width: 100%;
  border: none;
  border-bottom: 1px solid ${styles.grayLighter};
`;

export interface RequirementGroupSummaryProps {
  group: Model.RequirementGroup.Model;
  onBackClick: () => void;
}

export class RequirementGroupSummary extends React.PureComponent<RequirementGroupSummaryProps, {}> {
  render() {
    const { group, onBackClick } = this.props;
    return (
      <DegreeItem title="Summary">
        <DescriptionAction
          description={
            <>
              <Text>
                <strong>Description</strong>
              </Text>
              <Text dangerouslySetInnerHTML={{ __html: group.descriptionHtml }} />
              <HorizontalLine />

              <Paragraph>
                <strong>Credit hours</strong>
              </Paragraph>
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
              <Paragraph>
                Current Status:{' '}
                <strong>{group.courseValidationEnabled ? 'Enabled' : 'Disabled'}</strong>
              </Paragraph>
              <Paragraph>
                {group.courseValidationEnabled ? (
                  <>
                    Course validation is enabled meaning that students will get a non-dismissable
                    warning when the add courses that are not included in the course list defined
                    above.
                  </>
                ) : (
                  <>
                    Course validation is disabled meaning that students can freely add courses to
                    this group without warnings. This is recommended for requirement groups with too
                    many possible courses to maintain (e.g. Humanities and the Arts).
                  </>
                )}
              </Paragraph>
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
