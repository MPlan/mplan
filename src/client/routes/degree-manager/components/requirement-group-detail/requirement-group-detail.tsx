import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Input } from 'components/input';
import { RightClickMenu, RightClickProps } from 'components/right-click-menu';
import { InlineEdit } from 'components/inline-edit';
import { VerticalBar } from 'components/vertical-bar';
import { DropdownMenu } from 'components/dropdown-menu';
import { Paragraph } from 'components/paragraph';
import { PrimaryButton } from 'components/button';
import { Fa as _Fa } from 'components/fa';
import { Link } from 'components/link';
import { CreditHourEditor } from 'components/credit-hour-editor';
import { Switch } from 'components/switch';
import { DeleteConfirmationModal } from 'components/delete-confirmation-modal';

import { DegreeItem } from 'routes/degree-manager/components/degree-item';
import { DescriptionAction } from 'routes/degree-manager/components/description-action';
import { DescriptionEditor } from 'routes/degree-manager/components/description-editor';
import { PageNav } from 'routes/degree-manager/components/page-nav';
import { CourseList } from 'routes/degree-manager/components/course-list';
import { CoursePicker } from 'routes/degree-manager/components/course-picker';
import { RequirementGroupSummary } from 'routes/degree-manager/components/requirement-group-summary';

const Root = styled(View)`
  flex: 1 1 auto;
  overflow: hidden;
`;
const Body = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
  padding: 0 ${styles.space(1)};
`;
const Content = styled(View)`
  flex: 1 1 auto;
  width: 50rem;
  max-width: 100%;
  margin: ${styles.space(1)} auto;
  & > * {
    flex: 0 0 auto;
  }
`;
const TitleRow = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: ${styles.space(0)};
`;
const Title = styled(Text)`
  color: ${styles.textLight};
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  margin-right: ${styles.space(0)};
`;
const TitleInput = styled(Input)`
  color: ${styles.textLight};
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  margin-right: ${styles.space(0)};
  background-color: transparent;
  border: 1px solid ${styles.grayLight};
  outline: none;
  padding: 0;
`;
const Fa = styled(_Fa)`
  margin-right: ${styles.space(-1)};
`;

const DescriptionSubheading = styled(Text)`
  font-weight: bold;
  margin-bottom: ${styles.space(-1)};
`;
const Spacer = styled.div`
  flex: 0 0 auto;
  height: ${styles.space(1)};
`;
const ActionContainer = styled(View)`
  flex-direction: row;
`;
const Status = styled(Text)`
  margin-left: ${styles.space(0)};
`;

interface RequirementGroupDetailProps {
  masteredDegreeId: string;
  groupId: string;
  name: string;
  descriptionHtml: string;
  creditMinimum: number;
  creditMaximum: number;
  courseValidationEnabled: boolean;

  catalogIds: string[];
  presetCourses: { [catalogId: string]: true | undefined };
  onAddCourse: (catalogId: string) => void;
  onRemoveCourse: (catalogId: string) => void;
  onTogglePreset: (catalogId: string) => void;
  onRearrangeCourses: (oldIndex: number, newIndex: number) => void;

  onNameChange: (name: string) => void;
  onDescriptionChange: (descriptionHtml: string) => void;
  onCreditMinimumChange: (minimumCredits: number) => void;
  onCreditMaximumChange: (maximumCredits: number) => void;
  onBackClick: () => void;
  onPreviewClick: () => void;
  onDelete: () => void;

  onToggleCourseValidation: () => void;
}
interface RequirementGroupDetailState {
  editingName: boolean;
  coursePickerOpen: boolean;
  deleteConfirmationOpen: boolean;
}

export class RequirementGroupDetail extends React.Component<
  RequirementGroupDetailProps,
  RequirementGroupDetailState
> {
  constructor(props: RequirementGroupDetailProps) {
    super(props);

    this.state = {
      editingName: false,
      coursePickerOpen: false,
      deleteConfirmationOpen: false,
    };
  }

  degreeDropdownAction = {
    rename: {
      text: 'Rename',
      icon: 'pencil',
    },
    delete: {
      text: 'Delete',
      icon: 'trash',
      color: styles.danger,
    },
  };
  handleActions = (action: keyof typeof RequirementGroupDetail.prototype.degreeDropdownAction) => {
    if (action === 'rename') {
      this.setState({ editingName: true });
      return;
    }

    if (action === 'delete') {
      this.setState({ deleteConfirmationOpen: true });
      return;
    }
  };

  handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.props.onNameChange(value);
  };
  handleNameBlur = () => {
    this.setState({ editingName: false });
  };
  handleNameEdit = () => {
    this.setState({ editingName: true });
  };

  handleCoursePickerOpen = () => {
    this.setState({ coursePickerOpen: true });
  };
  handleCoursePickerClose = () => {
    this.setState({ coursePickerOpen: false });
  };

  handleDeleteConfirmationClose = () => {
    this.setState({ deleteConfirmationOpen: false });
  };

  renderTitleRow = (props: RightClickProps) => {
    const { name } = this.props;
    const { editingName } = this.state;
    return (
      <TitleRow {...props}>
        <InlineEdit
          value={name}
          renderDisplay={props => <Title {...props} />}
          renderInput={props => <TitleInput {...props} onChange={this.handleNameChange} />}
          editing={editingName}
          onBlur={this.handleNameBlur}
          onEdit={this.handleNameEdit}
        />
        <VerticalBar />
        <DropdownMenu
          header={name}
          actions={this.degreeDropdownAction}
          onAction={this.handleActions}
        />
      </TitleRow>
    );
  };

  render() {
    const {
      masteredDegreeId,
      groupId,
      name,
      creditMinimum,
      creditMaximum,
      descriptionHtml,
      presetCourses,
      courseValidationEnabled,
      onBackClick,
      onPreviewClick,
      onDescriptionChange,
      onCreditMaximumChange,
      onCreditMinimumChange,
      catalogIds,
      onAddCourse,
      onRemoveCourse,
      onRearrangeCourses,
      onTogglePreset,
      onToggleCourseValidation,
      onDelete,
    } = this.props;

    const { coursePickerOpen, deleteConfirmationOpen } = this.state;

    return (
      <>
        <Root>
          <Body>
            <Content>
              <PageNav backTitle="Back to degree" onBackClick={onBackClick} />
              <RightClickMenu
                header={name}
                actions={this.degreeDropdownAction}
                onAction={this.handleActions}
                children={this.renderTitleRow}
              />
              <DescriptionEditor descriptionHtml={descriptionHtml} onChange={onDescriptionChange}>
                <Paragraph>Edit the description of this course group here.</Paragraph>
                <Paragraph>
                  The description will appear when the student clicks the "More info" link under the
                  course group title. You can see how this looks this when you{' '}
                  <Link onClick={onPreviewClick}>preview the degree</Link>.
                </Paragraph>
              </DescriptionEditor>
              <DegreeItem title="Credit hours">
                <DescriptionAction
                  description={
                    <>
                      <DescriptionSubheading>Credit hour minimum</DescriptionSubheading>
                      <Paragraph>
                        The credit hour minimum is used to warn students when they have not added
                        enough courses to satisfy the group.
                      </Paragraph>
                      <Paragraph>
                        If the student fails to meet the credit hour minimum, they will receive a
                        non-dismissable warning that will go away once they meet the minimum.
                      </Paragraph>
                    </>
                  }
                >
                  <CreditHourEditor creditHours={creditMinimum} onChange={onCreditMinimumChange} />
                </DescriptionAction>
                <Spacer />
                <DescriptionAction
                  description={
                    <>
                      <DescriptionSubheading>Credit hour maximum</DescriptionSubheading>
                      <Paragraph>
                        The credit hour maximum is used to warn students when they have added too
                        many courses to this group.
                      </Paragraph>
                      <Paragraph>
                        Similar to the credit hour minimum, the student will receive a
                        non-dismissable warning. Furthermore, additional credits added past the
                        maximum will not count towards the <strong>degree</strong> credit hour
                        minimum defined on the previous page.
                      </Paragraph>
                    </>
                  }
                >
                  <CreditHourEditor creditHours={creditMaximum} onChange={onCreditMaximumChange} />
                </DescriptionAction>
              </DegreeItem>
              <DegreeItem title="Courses and validation">
                <DescriptionAction
                  description={
                    <>
                      <Paragraph>
                        Enabling this section enables <strong>course validation</strong>. When this
                        is disabled, students will be able to add any course to this group without
                        warning.
                      </Paragraph>
                      <Paragraph>
                        <strong>Course validation</strong> helps students check whether or not a
                        course added to this group will be allowed. When course validation is turned
                        on, students will receive non-dismissable warnings when they add courses
                        that are not defined here.
                      </Paragraph>
                      <Paragraph>
                        <strong>Disclaimer:</strong> though this feature helps validate some
                        courses, it is not meant to be thorough.{' '}
                        <em>MPlan is not a degree audit.</em>
                      </Paragraph>
                    </>
                  }
                >
                  <ActionContainer>
                    <Switch checked={courseValidationEnabled} onChange={onToggleCourseValidation} />
                    <Status>
                      Current Status:
                      <br />
                      {courseValidationEnabled ? (
                        <strong>Enabled</strong>
                      ) : (
                        <strong>Disabled</strong>
                      )}
                      <strong />
                    </Status>
                  </ActionContainer>
                </DescriptionAction>
                {courseValidationEnabled && (
                  <DescriptionAction
                    description={
                      <CourseList presetCourses={presetCourses} catalogIds={catalogIds} />
                    }
                  >
                    <PrimaryButton onClick={this.handleCoursePickerOpen}>
                      <Fa icon="pencil" /> Edit
                    </PrimaryButton>
                  </DescriptionAction>
                )}
              </DegreeItem>
              <RequirementGroupSummary masteredDegreeId={masteredDegreeId} groupId={groupId} />
            </Content>
          </Body>
        </Root>
        <CoursePicker
          title={`Editing default courses for ${name}…`}
          courseIds={catalogIds}
          presetCourses={presetCourses}
          onAdd={onAddCourse}
          onRemove={onRemoveCourse}
          open={coursePickerOpen}
          onClose={this.handleCoursePickerClose}
          onRearrange={onRearrangeCourses}
          onTogglePreset={onTogglePreset}
        />
        <DeleteConfirmationModal
          open={deleteConfirmationOpen}
          onClose={this.handleDeleteConfirmationClose}
          onConfirmDelete={onDelete}
          title={`Are you sure you want to delete "${name}"?`}
          confirmationText="Yes, delete it"
          icon="trash"
        />
      </>
    );
  }
}
