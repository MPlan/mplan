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
import { Fa as _Fa } from 'components/fa';
import { Link } from 'components/link';
import { CreditHourEditor } from 'components/credit-hour-editor';
import { RadioGroup } from 'components/radio-group';
import { DeleteConfirmationModal } from 'components/delete-confirmation-modal';
import { ActionableText } from 'components/actionable-text';
import { createInfoModal } from 'components/info-modal';
import { Empty } from 'components/empty';
import { PrimaryButton } from 'components/button';

import { DegreeItem } from 'routes/degree-manager/components/degree-item';
import { DescriptionAction } from 'routes/degree-manager/components/description-action';
import { DescriptionEditor } from 'routes/degree-manager/components/description-editor';
import { PageNav } from 'routes/degree-manager/components/page-nav';
import { CoursePicker } from 'routes/degree-manager/components/course-picker';
import { RequirementGroupSummary } from 'routes/degree-manager/components/requirement-group-summary';
import { CourseList } from 'routes/degree-manager/components/course-list';

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
const RadioDescription = styled(View)`
  margin-top: ${styles.space(-1)};
  margin-left: 2rem;
`;
const ButtonBar = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  margin-bottom: ${styles.space(-1)};
`;

const { Modal: RelaxModeModal, open: openRelaxModeInfo } = createInfoModal();
const { Modal: StrictModeModal, open: openStrictModeInfo } = createInfoModal();
const { Modal: AlternatesAllowedModal, open: openAlternatesAllowedModeInfo } = createInfoModal();

const courseModeOptions = [
  {
    value: 'relaxed',
    label: 'Relaxed',
    description: (
      <RadioDescription>
        <Paragraph>Allows students to add any courses.</Paragraph>
        <ActionableText onClick={openRelaxModeInfo}>More info</ActionableText>
      </RadioDescription>
    ),
  },
  {
    value: 'strict',
    label: 'Strict',
    description: (
      <RadioDescription>
        <Paragraph>Only allows the courses defined here.</Paragraph>
        <ActionableText onClick={openStrictModeInfo}>More info</ActionableText>
      </RadioDescription>
    ),
  },
  {
    value: 'alternates-allowed',
    label: 'Alternates Allowed',
    description: (
      <RadioDescription>
        <Paragraph>Allows alternate courses along with presets.</Paragraph>
        <ActionableText onClick={openAlternatesAllowedModeInfo}>More info</ActionableText>
      </RadioDescription>
    ),
  },
];

interface RequirementGroupDetailProps {
  masteredDegreeId: string;
  groupId: string;
  name: string;
  descriptionHtml: string;
  creditMinimum: number;
  creditMaximum: number;

  catalogIds: string[];
  presetCourses: { [catalogId: string]: true | undefined };
  courseMode: string; // 'relaxed' | 'strict' | 'alternates-allowed';

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

  onCourseModeChange: (mode: string) => void;
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

  constructor(props: RequirementGroupDetailProps) {
    super(props);

    this.state = {
      editingName: false,
      coursePickerOpen: false,
      deleteConfirmationOpen: false,
    };
  }

  get showNoActionNeeded() {
    return this.props.courseMode === 'relaxed';
  }

  get coursesEnabled() {
    return this.props.courseMode !== 'relaxed';
  }

  get hasCourses() {
    return this.props.catalogIds.length > 0;
  }

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
      catalogIds,
      courseMode,
      onBackClick,
      onPreviewClick,
      onDescriptionChange,
      onCreditMaximumChange,
      onCreditMinimumChange,
      onAddCourse,
      onRemoveCourse,
      onRearrangeCourses,
      onTogglePreset,
      onCourseModeChange,
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
              <DegreeItem title="Courses">
                <DescriptionAction
                  description={
                    <>
                      <Paragraph>
                        Use this section to enable course checking and set pre-populated default
                        courses for this requirement group.
                      </Paragraph>
                      {this.coursesEnabled && (
                        <ButtonBar>
                          <PrimaryButton onClick={this.handleCoursePickerOpen}>
                            <Fa icon={this.hasCourses ? 'pencil' : 'plus'} />
                            {this.hasCourses ? 'Edit' : 'Add'} Courses
                          </PrimaryButton>
                        </ButtonBar>
                      )}
                      {this.showNoActionNeeded && (
                        <Empty
                          title="No action needed."
                          subtitle={
                            <>
                              Switch to a different mode if you'd like to add courses.
                              <br />
                              In Relaxed mode, there is no need to add courses.
                            </>
                          }
                        />
                      )}
                      {this.coursesEnabled && (
                        <CourseList
                          showDefaults={courseMode === 'alternates-allowed'}
                          catalogIds={catalogIds}
                          presetCourses={presetCourses}
                        />
                      )}
                    </>
                  }
                >
                  <Paragraph style={{ fontWeight: 'bold' }}>Mode:</Paragraph>
                  <RadioGroup
                    value={courseMode}
                    options={courseModeOptions}
                    onChange={onCourseModeChange}
                  />
                </DescriptionAction>
              </DegreeItem>
              <RequirementGroupSummary masteredDegreeId={masteredDegreeId} groupId={groupId} />
            </Content>
          </Body>
        </Root>
        <CoursePicker
          title={`Editing courses for "${name}"…`}
          courseIds={catalogIds}
          presetCourses={presetCourses}
          presetsEnabled={courseMode === 'alternates-allowed'}
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
        <RelaxModeModal title="Relaxed Mode">
          <Paragraph>Relaxed mode allows students to add any courses to this group.</Paragraph>
          <Paragraph>
            This mode is recommended for requirement groups that span a wide variety of courses such
            as "Humanities and the Arts" and "Social and Behavioral Analysis".
          </Paragraph>
          <Paragraph>
            The general recommendation is to use this mode when it's too hard to create a list of
            courses to maintain. Requirement groups like "Technical Electives" or "Applications" may
            also be good candidates for this mode.
          </Paragraph>
        </RelaxModeModal>
        <StrictModeModal title="Strict Mode">
          <Paragraph>
            Strict mode pre-populates this requirement group in a student's degree worksheet with
            the courses defined here and does not allow any deviance.
          </Paragraph>
          <Paragraph>
            This mode is recommended for requirement groups where almost all the students will take
            the same courses such as "Written and Oral Communication" where almost all students will
            take COMP 105 and COMP 270.
          </Paragraph>
          <Paragraph>
            <strong>Note:</strong> in the case of petitions/edge cases, students will still be able
            to add courses that are not listed in this group but if they do, they will receive a
            non-dismissable warning.
          </Paragraph>
        </StrictModeModal>
        <AlternatesAllowedModal title="Alternates Allowed Mode">
          <Paragraph>
            Alternates Allowed mode allows alternate courses along with presets.
          </Paragraph>
          <Paragraph>
            This mode is recommended if there is a some choice involved in the requirement group.
            Requirement groups such as "Technical Electives" and "Laboratory Sciences" are good
            candidates for this mode.
          </Paragraph>
          <Paragraph>
            <strong>Note:</strong> in the case of petitions/edge cases, students will still be able
            to add courses that are not listed in this group but if they do, they will receive a
            non-dismissable warning.
          </Paragraph>
        </AlternatesAllowedModal>
      </>
    );
  }
}
