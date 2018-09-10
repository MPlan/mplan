import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Paragraph } from 'components/paragraph';
import { Fa } from 'components/fa';
import { Actions } from 'components/dropdown-menu';
import { Divider } from 'components/divider';
import { ActionableText } from 'components/actionable-text';
import { createInfoModal } from 'components/info-modal';
import { Link as _Link } from 'react-router-dom';
import { DegreeItem } from 'routes/degree-manager/components/degree-item';
import { CourseGroup } from './course-group';
import { DescriptionAction } from 'routes/degree-manager/components/description-action';

const Columns = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(0)};
  & > :not(:last-child) {
    margin-right: ${styles.space(0)};
  }
`;
const Column = styled(View)`
  flex: 1 1 calc(33% - ${styles.space(0)});
`;
const ColumnHeader = styled(Text)`
  font-weight: bold;
  margin: 0 ${styles.space(-1)};
  margin-bottom: ${styles.space(-1)};
`;
const AddToActionableText = styled(ActionableText)`
  font-size: ${styles.space(-1)};
  margin: 0 ${styles.space(-1)};
  margin-top: auto;
  text-transform: uppercase;
`;
const Spacer = styled.div`
  height: ${styles.space(0)};
`;
const TextContainer = styled(View)`
  margin-bottom: ${styles.space(0)};
`;
const Link = styled(_Link)`
  font-family: ${styles.fontFamily};
  color: ${styles.link};
  text-decoration: none;
  &:active {
    color: ${styles.linkActive};
  }
  &:focus,
  &:hover {
    text-decoration: underline;
    ${styles.linkHover};
    cursor: pointer;
  }
`;

interface CourseGroupSummaryProps {
  onGroupClick: (groupId: string) => void;
}

const actions: Actions<'add' | 'rearrange'> = {
  add: {
    icon: 'plus',
    color: styles.blue,
    text: 'Create group',
  },
  rearrange: {
    icon: 'bars',
    text: 'Rearrange',
  },
};

export class CourseGroupSummary extends React.PureComponent<CourseGroupSummaryProps, {}> {
  infoModal = createInfoModal();
  render() {
    const InfoModal = this.infoModal.Modal;
    return (
      <DegreeItem
        title="Course groups"
        dropdownMenuProps={{
          header: 'Course groups',
          actions,
          onAction: () => {},
        }}
      >
        <DescriptionAction
          description={
            <TextContainer>
              <Paragraph>
                Course groups represent groups of courses that represent a particular requirement as
                part of a degree program.
              </Paragraph>
              <Paragraph>
                An example course group would be "Writing and Oral Communication" which would
                include the courses <Link to="/catalog/comp-150">COMP 105</Link> and{' '}
                <Link to="/catalog/comp-270">COMP 270</Link>.
              </Paragraph>
              <ActionableText onClick={this.infoModal.open}>
                Click here for more info
              </ActionableText>
            </TextContainer>
          }
          children={<></>}
        />

        <Columns>
          <Column>
            <ColumnHeader>Column one</ColumnHeader>
            <Divider />
            <CourseGroup
              title="Written and Oral Communication"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => this.props.onGroupClick('test-group')}
            />
            <CourseGroup
              title="Humanities and the Arts"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <CourseGroup
              title="Social and Behavior Analysis"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <Spacer />
            <AddToActionableText>Create group in column one</AddToActionableText>
          </Column>
          <Column>
            <ColumnHeader>Column two</ColumnHeader>
            <Divider />
            <CourseGroup
              title="Mathematics and Statistics"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <CourseGroup
              title="Laboratory Science"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <CourseGroup
              title="Additional Science"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <CourseGroup
              title="Business Courses"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <Spacer />
            <AddToActionableText>Create group in column two</AddToActionableText>
          </Column>
          <Column>
            <ColumnHeader>Column three</ColumnHeader>
            <Divider />
            <CourseGroup
              title="CIS Courses"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <CourseGroup
              title="Required Courses for SE"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <CourseGroup
              title="Application Sequence"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <CourseGroup
              title="Technical Electives"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <CourseGroup
              title="General Electives"
              courseCount={5}
              creditHours="3 - 6 credits"
              onClick={() => {}}
            />
            <Spacer />
            <AddToActionableText>Create group in column three</AddToActionableText>
          </Column>
        </Columns>
        <InfoModal title="Course groups">
          <Paragraph>More info on course groups coming soon...</Paragraph>
        </InfoModal>
      </DegreeItem>
    );
  }
}
