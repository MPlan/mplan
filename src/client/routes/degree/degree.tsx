import * as React from 'react';
import * as Model from 'models';
import { View } from 'components/view';
import { Text } from 'components/text';
import { ActionableText } from 'components/actionable-text';
import { FloatingActionButton } from 'components/floating-action-button';
import { DegreeGroup } from 'components/degree-group';
import { Modal } from 'components/modal';
import styled from 'styled-components';
import * as styles from 'styles';
import { CourseSearch } from 'components/course-search';
import { Reorder } from 'components/reorder';
import { ReorderCourse } from './components/reorder-course';
import { SortEnd } from 'react-sortable-hoc';

const Container = styled(View)`
  padding: ${styles.space(1)};
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
`;
const Header = styled(View)`
  flex-direction: row;
  align-items: baseline;
  margin-bottom: ${styles.space(1)};
  flex-shrink: 0;
`;
const HeaderMain = styled(View)`
  flex: 1;
`;
const HeaderRight = styled(View)`
  align-items: flex-end;
`;
const Major = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin-bottom: ${styles.space(-1)};
`;
const Disclaimer = styled(Text)`
  color: ${styles.textLight};
`;
const Underline = styled(Text)`
  text-decoration: underline;
  color: ${styles.textLight};
`;
const Credits = styled(Text)`
  color: ${styles.textLight};
  font-weight: ${styles.bold};
  font-size: ${styles.space(1)};
`;
const RequiredCredits = styled(Text)`
  font-weight: bold;
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const Percentage = styled(Text)`
  color: ${styles.textLight};
  margin-bottom: ${styles.space(-1)};
`;
const DegreeGroupContainer = styled(View)`
  flex: 1;
  flex-wrap: wrap;
  flex-direction: row;
  margin-right: -${styles.space(2)};
`;
const FormMajor = styled.form`
  display: flex;
  flex-direction: column;
`;
const DescriptionNonEdit = styled(View)`
  &,
  & * {
    font-family: ${styles.fontFamily};
  }
`;

const fabActions = {
  group: {
    text: 'New course group',
    icon: 'plus',
    color: styles.blue,
  },
  course: {
    text: 'Course to existing group',
    icon: 'plus',
    color: styles.blue,
  },
};

export interface DegreeProps {
  degree: Model.Degree;
  masteredDegrees: Model.MasteredDegree[];
  currentDegreeGroup: Model.DegreeGroup | undefined;

  onAddCourseClick: (degreeGroup: Model.DegreeGroup) => void;
  onAddCourseModalClose: () => void;
  onDegreeGroupCoursesChange: (degreeGroup: Model.DegreeGroup, newCourse: Model.Course[]) => void;
  onDeleteCourse: (degreeGroup: Model.DegreeGroup, course: string | Model.Course) => void;

  onDegreeGroupDelete: (degreeGroup: Model.DegreeGroup) => void;
  onDegreeGroupNameChange: (degreeGroup: Model.DegreeGroup, newName: string) => void;
  onDegreeGroupAddCourse: (degreeGroup: Model.DegreeGroup, course: string | Model.Course) => void;
  onCourseCompletedToggle: (degreeGroup: Model.DegreeGroup, course: string | Model.Course) => void;
  onAddDegreeGroup: () => void;
  onDegreeGroupCoursesReorder: (degreeGroup: Model.DegreeGroup, sortEnd: SortEnd) => void;

  onChangeMajor: (majorId: string) => void;
}

export interface DegreeState {
  majorModalOpen: boolean;
  activeDegree: Model.DegreeGroup | undefined;
  requiredCreditsModalOpen: boolean;
  disclaimerModalOpen: boolean;
  activeReorderGroupId: string | undefined;
}

export class Degree extends React.Component<DegreeProps, DegreeState> {
  constructor(props: DegreeProps) {
    super(props);
    this.state = {
      majorModalOpen: false,
      activeDegree: undefined,
      requiredCreditsModalOpen: false,
      disclaimerModalOpen: false,
      activeReorderGroupId: undefined,
    };
  }

  get activeDegreeTitle() {
    const activeDegree = this.state.activeDegree;
    if (!activeDegree) return '';
    return activeDegree.name;
  }

  get activeDegreeDescription() {
    const activeDegree = this.state.activeDegree;
    if (!activeDegree) return '';
    return activeDegree.descriptionHtml;
  }

  get reorderingCourses() {
    return !!this.state.activeReorderGroupId;
  }

  get activeReorderGroup() {
    return this.props.degree.degreeGroups.find(
      group => group.id === this.state.activeReorderGroupId,
    );
  }

  get reorderCoursesTitle() {
    const activeDegree = this.activeReorderGroup;
    if (!activeDegree) return '';
    return `Reordering ${activeDegree.name}...`;
  }

  get activeReorderCourses() {
    const activeReorderGroup = this.activeReorderGroup;
    if (!activeReorderGroup) return [];
    return activeReorderGroup.courses().toArray();
  }

  renderReorderCourse = (course: Model.Course) => {
    return <ReorderCourse course={course} />;
  };

  handleFab = (action: keyof typeof fabActions) => {
    if (action === 'group') {
      this.props.onAddDegreeGroup();
    }
  };

  handleCourseSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  handleChangeDegree = () => {
    this.setState(previousState => ({
      ...previousState,
      majorModalOpen: true,
    }));
  };

  handleMajorBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      majorModalOpen: false,
    }));
  };

  handleMajorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const selectElement = e.currentTarget.querySelector('.select-major') as HTMLSelectElement;
    const majorId = selectElement.value;
    if (!majorId) return;
    this.props.onChangeMajor(majorId);
  };

  handleSaveCourses = (courses: Model.Course[]) => {
    const currentDegreeGroup = this.props.currentDegreeGroup;
    if (!currentDegreeGroup) return;
    this.props.onDegreeGroupCoursesChange(currentDegreeGroup, courses);
    this.props.onAddCourseModalClose();
  };

  handleDegreeGroupHeaderClick(group: Model.DegreeGroup) {
    this.setState(previousState => ({
      ...previousState,
      activeDegree: group,
    }));
  }

  handleDegreeGroupModalBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      activeDegree: undefined,
    }));
  };

  handleCreditsRequiredClick = () => {
    this.setState(previousState => ({
      ...previousState,
      requiredCreditsModalOpen: true,
    }));
  };

  handleCreditsRequiredBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      requiredCreditsModalOpen: false,
    }));
  };

  handleDisclaimerClick = () => {
    this.setState(previousState => ({
      ...previousState,
      disclaimerModalOpen: true,
    }));
  };

  handleDisclaimerModalBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      disclaimerModalOpen: false,
    }));
  };

  handleReorderStart(degreeGroup: Model.DegreeGroup) {
    this.setState(previousState => ({
      ...previousState,
      activeReorderGroupId: degreeGroup.id,
    }));
  }

  handleReorderCoursesClose = () => {
    this.setState(previousState => ({
      ...previousState,
      activeReorderGroupId: undefined,
    }));
  };

  handleCoursesReorder = (e: SortEnd) => {
    const activeReorderGroup = this.activeReorderGroup;
    if (!activeReorderGroup) return;
    this.props.onDegreeGroupCoursesReorder(activeReorderGroup, e);
  };

  render() {
    const currentDegreeGroup = this.props.currentDegreeGroup;
    const degree = this.props.degree;
    const masteredDegree = degree.masteredDegree();
    return (
      <Container>
        <Header>
          <HeaderMain>
            <Major>{masteredDegree && masteredDegree.name}</Major>
            <Disclaimer onClick={this.handleDisclaimerClick}>
              <Underline>Disclaimer:</Underline> This page is <Underline>not</Underline> a degree
              audit and should not be treated like one.{' '}
              <ActionableText>Click here for more info.</ActionableText>
            </Disclaimer>
          </HeaderMain>
          <HeaderRight>
            <Credits>
              {degree.completedCredits()}/{degree.totalCredits()} credits
            </Credits>
            <Percentage>{degree.percentComplete()} complete</Percentage>
            <RequiredCredits
              onClick={this.handleCreditsRequiredClick}
              color={
                degree.totalCredits() < degree.masteredDegree().minimumCredits
                  ? styles.danger
                  : styles.info
              }
            >
              {degree.masteredDegree().minimumCredits} credits required
            </RequiredCredits>
            <ActionableText onClick={this.handleChangeDegree}>
              Click here to change degree!
            </ActionableText>
          </HeaderRight>
        </Header>
        <DegreeGroupContainer>
          {degree.degreeGroups.map(group => (
            <DegreeGroup
              key={group.id}
              degreeGroup={group}
              onNameChange={newName => this.props.onDegreeGroupNameChange(group, newName)}
              onAddCourse={() => this.props.onAddCourseClick(group)}
              onDeleteCourse={course => this.props.onDeleteCourse(group, course)}
              onDeleteGroup={() => this.props.onDegreeGroupDelete(group)}
              onCourseCompletedToggle={course => this.props.onCourseCompletedToggle(group, course)}
              onHeaderClick={() => this.handleDegreeGroupHeaderClick(group)}
              onReorderCoursesStart={() => this.handleReorderStart(group)}
            />
          ))}
        </DegreeGroupContainer>
        <FloatingActionButton message="Add…" actions={fabActions} onAction={this.handleFab} />
        <CourseSearch
          title={`Editing courses for ${currentDegreeGroup ? currentDegreeGroup.name : ''}`}
          open={!!currentDegreeGroup}
          defaultCourses={currentDegreeGroup ? currentDegreeGroup.courses().toArray() : []}
          onCancel={this.props.onAddCourseModalClose}
          onSaveCourses={this.handleSaveCourses}
        />
        <Modal
          title="Pick a major!"
          open={this.state.majorModalOpen}
          onBlurCancel={this.handleMajorBlur}
        >
          <FormMajor onSubmit={this.handleMajorSubmit}>
            <select className="select-major">
              {this.props.masteredDegrees.map(degree => (
                <option key={degree.id} value={degree.id}>
                  {degree.name}
                </option>
              ))}
            </select>
            <div>
              <button type="button" onClick={this.handleMajorBlur}>
                cancel
              </button>
              <button type="submit">select major</button>
            </div>
          </FormMajor>
        </Modal>
        <Modal
          title={this.activeDegreeTitle}
          open={!!this.state.activeDegree}
          onBlurCancel={this.handleDegreeGroupModalBlur}
          size="medium"
        >
          <DescriptionNonEdit dangerouslySetInnerHTML={{ __html: this.activeDegreeDescription }} />
        </Modal>
        <Modal
          title="About Required Credits"
          open={this.state.requiredCreditsModalOpen}
          onBlurCancel={this.handleCreditsRequiredBlur}
          size="medium"
        >
          <p>
            <Text>
              This degree requires you to have at least{' '}
              <strong>{degree.masteredDegree().minimumCredits}</strong> credits in order to
              graduate. When you first enroll in a degree program, you may have to add courses to
              this worksheet to reach this requirement.
            </Text>
          </p>

          <p>
            <Text>
              For example, your advisor may have created an "Electives" group with no default
              courses. In this case, you'll have to add courses that group so your total credit hour
              count equals or exceeds the required minimum credits for this degree.
            </Text>
          </p>
        </Modal>
        <Modal
          title="Disclaimer"
          open={this.state.disclaimerModalOpen}
          onBlurCancel={this.handleDisclaimerModalBlur}
          size="medium"
        >
          <p>
            <Text>
              Though MPlan has <em>some</em> degree validation abilities, it is <strong>NOT</strong>{' '}
              a degree audit and should not be treated as one. Furthermore, MPlan is{' '}
              <strong>NOT</strong> a replacement other degree audits tools such as
              DegreeWorks&trade;.
            </Text>
          </p>

          <p>
            <Text>
              Please use this tool with cation and ask your advisor if you have any questions.
            </Text>
          </p>

          <p>
            <Text>Thank you and enjoy!</Text>
          </p>
        </Modal>
        <Reorder
          title={this.reorderCoursesTitle}
          open={this.reorderingCourses}
          elements={this.activeReorderCourses}
          render={this.renderReorderCourse}
          onClose={this.handleReorderCoursesClose}
          onReorder={this.handleCoursesReorder}
        />
      </Container>
    );
  }
}
