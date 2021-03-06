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
import { Empty } from 'components/empty';
import { DeleteConfirmationModal } from 'components/delete-confirmation-modal';
import { DegreeItem } from 'routes/degree-manager/components/degree-item';
import { DescriptionAction } from 'routes/degree-manager/components/description-action';
import { CreateGroupModal } from './create-group-modal';
import { RequirementGroup } from './requirement-group';
import { RearrangeGroups } from './rearrange-groups';

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

export interface GroupViewModel {
  id: string;
  name: string;
  creditMinimum: number;
  creditMaximum: number;
}

interface RequirementGroupListProps {
  masteredDegreeId: string;
  groupsColumnOne: GroupViewModel[];
  groupsColumnTwo: GroupViewModel[];
  groupsColumnThree: GroupViewModel[];
  onDelete: (groupId: string) => void;
  onGroupClick: (groupId: string) => void;
  onCreateGroup: (groupName: string, column: number) => void;
}
interface RequirementGroupListState {
  createGroupModalOpen: boolean;
  rearrangeModalOpen: boolean;
  deleteConfirmationGroupId: string | undefined;
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

export class RequirementGroupList extends React.PureComponent<
  RequirementGroupListProps,
  RequirementGroupListState
> {
  infoModal = createInfoModal();

  constructor(props: RequirementGroupListProps) {
    super(props);

    this.state = {
      createGroupModalOpen: false,
      rearrangeModalOpen: false,
      deleteConfirmationGroupId: undefined,
    };
  }

  get deleteConfirmationOpen() {
    return !!this.state.deleteConfirmationGroupId;
  }
  get groupToDeleteName() {
    const { deleteConfirmationGroupId } = this.state;
    if (!deleteConfirmationGroupId) return undefined;
    const { groupsColumnOne, groupsColumnTwo, groupsColumnThree } = this.props;
    const groups = [...groupsColumnOne, ...groupsColumnTwo, ...groupsColumnThree];
    const group = groups.find(group => group.id === deleteConfirmationGroupId);
    if (!group) return undefined;
    return group.name;
  }

  get empty() {
    const { groupsColumnOne, groupsColumnTwo, groupsColumnThree } = this.props;
    if (groupsColumnOne.length > 0) return false;
    if (groupsColumnTwo.length > 0) return false;
    if (groupsColumnThree.length > 0) return false;
    return true;
  }

  handleDropdownActions = (action: keyof typeof actions) => {
    if (action === 'add') {
      this.handleCreateGroupOpen();
      return;
    }

    if (action === 'rearrange') {
      this.handleRearrangeOpen();
      return;
    }
  };

  dropdownProps = {
    header: 'Requirement groups',
    actions,
    onAction: this.handleDropdownActions,
  };

  handleCreateGroupOpen = () => {
    this.setState({ createGroupModalOpen: true });
  };
  handleCreateGroupClose = () => {
    this.setState({ createGroupModalOpen: false });
  };
  handleRearrangeOpen = () => {
    this.setState({ rearrangeModalOpen: true });
  };
  handleRearrangeClose = () => {
    this.setState({ rearrangeModalOpen: false });
  };

  handleDeleteOpen = (groupId: string) => {
    this.setState({ deleteConfirmationGroupId: groupId });
  };
  handleDeleteClear = () => {
    this.setState({ deleteConfirmationGroupId: undefined });
  };

  handleOnConfirmDelete = () => {
    const { deleteConfirmationGroupId } = this.state;
    if (!deleteConfirmationGroupId) return;
    this.props.onDelete(deleteConfirmationGroupId);
    this.handleDeleteClear();
  };

  render() {
    const { createGroupModalOpen, rearrangeModalOpen } = this.state;
    const {
      groupsColumnOne,
      groupsColumnTwo,
      groupsColumnThree,
      masteredDegreeId,
      onCreateGroup,
    } = this.props;

    const InfoModal = this.infoModal.Modal;
    return (
      <>
        <DegreeItem title="Requirement groups" dropdownMenuProps={this.dropdownProps}>
          <DescriptionAction
            description={
              <TextContainer>
                <Paragraph>
                  Requirement groups are groups of courses that represent a particular requirement
                  as part of a degree program.
                </Paragraph>
                <Paragraph>
                  An example course group would be "Writing and Oral Communication" which would
                  include the courses <Link to="/catalog/COMP/105">COMP 105</Link> and{' '}
                  <Link to="/catalog/COMP/270">COMP 270</Link>.
                </Paragraph>
                <Paragraph>
                  Requirement groups appear to students as a list of courses in three columns that
                  they can add and remove courses from. Once a student adds a course, it will become
                  part of their MPlan—which means they plan to, or, have already taken the course.
                  That information will be used to calculate their personalized sequence of courses.
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
            <Empty title="Nothing here yet!" subtitle="Create a new group to begin." />
          ) : (
            <Columns>
              <Column>
                <ColumnHeader>Column one</ColumnHeader>
                <Divider />
                {groupsColumnOne.map(group => (
                  <RequirementGroup
                    key={group.id}
                    name={group.name}
                    creditMinimum={group.creditMinimum}
                    creditMaximum={group.creditMaximum}
                    onClick={() => this.props.onGroupClick(group.id)}
                    onRearrange={this.handleRearrangeOpen}
                    onDelete={() => this.handleDeleteOpen(group.id)}
                  />
                ))}
              </Column>
              <Column>
                <ColumnHeader>Column two</ColumnHeader>
                <Divider />
                {groupsColumnTwo.map(group => (
                  <RequirementGroup
                    key={group.id}
                    name={group.name}
                    creditMinimum={group.creditMinimum}
                    creditMaximum={group.creditMaximum}
                    onClick={() => this.props.onGroupClick(group.id)}
                    onRearrange={this.handleRearrangeOpen}
                    onDelete={() => this.handleDeleteOpen(group.id)}
                  />
                ))}
              </Column>
              <Column>
                <ColumnHeader>Column three</ColumnHeader>
                <Divider />
                {groupsColumnThree.map(group => (
                  <RequirementGroup
                    key={group.id}
                    name={group.name}
                    creditMinimum={group.creditMinimum}
                    creditMaximum={group.creditMaximum}
                    onClick={() => this.props.onGroupClick(group.id)}
                    onRearrange={this.handleRearrangeOpen}
                    onDelete={() => this.handleDeleteOpen(group.id)}
                  />
                ))}
              </Column>
            </Columns>
          )}
        </DegreeItem>
        <InfoModal title="Requirement groups">
          <Paragraph>
            Requirement groups are groups of courses that represent a particular requirement as part
            of a degree program.
          </Paragraph>
          <Paragraph>
            An example course group would be "Writing and Oral Communication" which would include
            the courses <Link to="/catalog/COMP/105">COMP 105</Link> and{' '}
            <Link to="/catalog/COMP/270">COMP 270</Link>.
          </Paragraph>
          <Paragraph>
            Requirement groups appear to students as a list of courses that they can add and remove
            courses from. Once a student adds a course, it will become part of their MPlan—as in
            they plan to, or, have already taken the course—and that information will be used to
            calculate their personalized sequence of courses.
          </Paragraph>
          <Paragraph>
            When you define a course group here, you define:
            <ol>
              <li>A description of the group.</li>
              <li>The minimum number of credits needed to satisfy this group.</li>
              <li>The maximum number of credits this group allows.</li>
              <li>
                A list of default courses that appear when the student initially selects the degree
                program.
              </li>
              <li>A list of courses that a student is allowed to add for this particular group.</li>
            </ol>
          </Paragraph>
          <Paragraph>
            <strong>Disclaimer:</strong> when a student fails to meet any of the requirements
            defined above, MPlan <em>will not block them</em> from doing so. Instead they will get a
            non-dismissable warning that will won't go away throughout their usage of MPlan.
          </Paragraph>
          <Text>
            MPlan is <em>not</em> a degree audit and should not be treated like one. Email or ping
            us using the chat bubble on your lower-right if you have any questions.
          </Text>
        </InfoModal>
        <CreateGroupModal
          open={createGroupModalOpen}
          onClose={this.handleCreateGroupClose}
          onCreateGroup={onCreateGroup}
        />
        <RearrangeGroups
          open={rearrangeModalOpen}
          masteredDegreeId={masteredDegreeId}
          onClose={this.handleRearrangeClose}
        />
        <DeleteConfirmationModal
          open={this.deleteConfirmationOpen}
          title={`Are you sure you want to delete "${this.groupToDeleteName}"?`}
          onClose={this.handleDeleteClear}
          onConfirmDelete={this.handleOnConfirmDelete}
          confirmationText="Yes, delete it"
        />
      </>
    );
  }
}
