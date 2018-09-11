import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Link as _Link } from 'react-router-dom';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Paragraph } from 'components/paragraph';
import { PrimaryButton } from 'components/button';
import { Actions } from 'components/dropdown-menu';
import { Divider } from 'components/divider';
import { ActionableText } from 'components/actionable-text';
import { createInfoModal } from 'components/info-modal';
import { DegreeItem } from 'routes/degree-manager/components/degree-item';
import { DescriptionAction } from 'routes/degree-manager/components/description-action';
import { CreateGroupModal } from './create-group-modal';
import { CourseGroup } from './course-group';

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
const Empty = styled(View)`
  height: 15rem;
  justify-content: center;
  align-items: center;
  text-align: center;
`;
const EmptyTitle = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.grayLight};
`;
const EmptySubtitle = styled(Text)`
  color: ${styles.grayLight};
  font-size: ${styles.space(0)};
`;

export interface CourseGroupViewModel {
  id: string;
  name: string;
  creditMinimum: number;
  creditMaximum: number;
}

interface CourseGroupSummaryProps {
  courseGroupsColumnOne: CourseGroupViewModel[];
  courseGroupsColumnTwo: CourseGroupViewModel[];
  courseGroupsColumnThree: CourseGroupViewModel[];
  onRearrange: () => void;
  onDelete: (groupId: string) => void;
  onChangeColumn: (groupId: string) => void;
  onGroupClick: (groupId: string) => void;
  onCreateGroup: (groupName: string, column: number) => void;
}
interface CourseGroupSummaryState {
  createGroupModalOpen: boolean;
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

export class CourseGroupSummary extends React.PureComponent<
  CourseGroupSummaryProps,
  CourseGroupSummaryState
> {
  infoModal = createInfoModal();

  constructor(props: CourseGroupSummaryProps) {
    super(props);

    this.state = {
      createGroupModalOpen: false,
    };
  }

  get empty() {
    const { courseGroupsColumnOne, courseGroupsColumnTwo, courseGroupsColumnThree } = this.props;
    if (courseGroupsColumnOne.length > 0) return false;
    if (courseGroupsColumnTwo.length > 0) return false;
    if (courseGroupsColumnThree.length > 0) return false;
    return true;
  }

  handleDropdownActions = (action: keyof typeof actions) => {};

  dropdownProps = {
    header: 'Course groups',
    actions,
    onAction: this.handleDropdownActions,
  };

  handleCreateGroupOpen = () => {
    this.setState({ createGroupModalOpen: true });
  };
  handleCreateGroupClose = () => {
    this.setState({ createGroupModalOpen: false });
  };

  render() {
    const { createGroupModalOpen } = this.state;
    const {
      onCreateGroup,
      courseGroupsColumnOne,
      courseGroupsColumnTwo,
      courseGroupsColumnThree,
    } = this.props;
    const InfoModal = this.infoModal.Modal;
    return (
      <>
        <DegreeItem title="Course groups" dropdownMenuProps={this.dropdownProps}>
          <DescriptionAction
            description={
              <TextContainer>
                <Paragraph>
                  Course groups represent groups of courses that represent a particular requirement
                  as part of a degree program.
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
          >
            <PrimaryButton onClick={this.handleCreateGroupOpen}>+ Create new group</PrimaryButton>
          </DescriptionAction>

          {this.empty ? (
            <Empty>
              <EmptyTitle>Nothing here yet!</EmptyTitle>
              <EmptySubtitle>Create a new group to begin.</EmptySubtitle>
            </Empty>
          ) : (
            <Columns>
              <Column>
                <ColumnHeader>Column one</ColumnHeader>
                <Divider />
                {courseGroupsColumnOne.map(group => (
                  <CourseGroup
                    key={group.id}
                    name={group.name}
                    creditMinimum={group.creditMinimum}
                    creditMaximum={group.creditMaximum}
                    onClick={() => this.props.onGroupClick(group.id)}
                  />
                ))}
              </Column>
              <Column>
                <ColumnHeader>Column two</ColumnHeader>
                <Divider />
                {courseGroupsColumnTwo.map(group => (
                  <CourseGroup
                    key={group.id}
                    name={group.name}
                    creditMinimum={group.creditMinimum}
                    creditMaximum={group.creditMaximum}
                    onClick={() => this.props.onGroupClick(group.id)}
                  />
                ))}
              </Column>
              <Column>
                <ColumnHeader>Column three</ColumnHeader>
                <Divider />
                {courseGroupsColumnThree.map(group => (
                  <CourseGroup
                    key={group.id}
                    name={group.name}
                    creditMinimum={group.creditMinimum}
                    creditMaximum={group.creditMaximum}
                    onClick={() => this.props.onGroupClick(group.id)}
                  />
                ))}
              </Column>
            </Columns>
          )}
        </DegreeItem>
        <InfoModal title="Course groups">
          <Paragraph>More info on course groups coming soon...</Paragraph>
        </InfoModal>
        <CreateGroupModal
          open={createGroupModalOpen}
          onClose={this.handleCreateGroupClose}
          onCreateGroup={onCreateGroup}
        />
      </>
    );
  }
}
