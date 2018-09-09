import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Switch } from 'components/switch';
import { DegreeItem } from './degree-item';
import { DescriptionAction } from './description-action';
import { Paragraph } from 'components/paragraph';
import { ActionableText } from 'components/actionable-text';
import { createInfoModal } from 'components/info-modal';

const ActionContainer = styled(View)`
  flex-direction: row;
  & ${Text} {
    margin-left: ${styles.space(0)};
  }
`;

const Question = styled(Text)`
  font-weight: bold;
  font-style: italic;
  margin: ${styles.space(0)} 0;
`;

const Answer = styled(Text)``;

export class PublishUnlist extends React.PureComponent<{}, {}> {
  publishUnlistInfo = createInfoModal();

  render() {
    const PublishUnlistModal = this.publishUnlistInfo.Modal;
    return (
      <>
        <DegreeItem title="Publish or unlist">
          <DescriptionAction
            description={
              <>
                <Paragraph>Degree programs can be either published or unlisted.</Paragraph>
                <Paragraph>
                  It is recommended that you do not publish degrees until all information is
                  entered. Published degrees are for students to select and are visible to all users
                  of MPlan.
                </Paragraph>
                <Paragraph>
                  Unlisted degrees are only available to admins and students who previously selected
                  them.
                </Paragraph>
                <ActionableText onClick={this.publishUnlistInfo.open}>
                  Click here for more info.
                </ActionableText>
              </>
            }
          >
            <ActionContainer>
              <Switch />
              <Text>
                Current Status:
                <br />
                <strong>Unlisted</strong>
              </Text>
            </ActionContainer>
          </DescriptionAction>
        </DegreeItem>
        <PublishUnlistModal title="Publish or unlist">
          <Text>FAQ</Text>
          <Question>What happens when I publish a degree?</Question>
          <Answer>
            When you publish a degree, it becomes a listed degree available for students to select
            as their degree in MPlan. When students select a published degree, it will link their
            degree worksheet (in MPlan only) to the published degree. Any changes made to the
            published degree will be reflected in a student's degree worksheet.
          </Answer>
          <Question>What happens when I unlist a degree?</Question>
          <Answer>
            Unlisting a degree hides the degree from the public degree listings. Students will not
            be able to select an unlisted degree but students who previously selected the degree
            will be able to continue to use the degree.
            <br />
            <br />
            <strong>Note:</strong> Unlisted degrees are still linked to the degree worksheets of
            students who selected them, so changes to unlisted degrees will still affect those
            students.
          </Answer>
        </PublishUnlistModal>
      </>
    );
  }
}
