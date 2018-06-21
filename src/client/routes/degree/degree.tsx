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
  margin-bottom: ${styles.space(-1)};
`;
const Percentage = styled(Text)`
  color: ${styles.textLight};
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

  onChangeMajor: (majorId: string) => void;
}

export interface DegreeState {
  majorModalOpen: boolean;
}

export class Degree extends React.PureComponent<DegreeProps, DegreeState> {
  state = {
    majorModalOpen: false,
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

  render() {
    const currentDegreeGroup = this.props.currentDegreeGroup;
    const degree = this.props.degree;
    const masteredDegree = degree.masteredDegree();
    return (
      <Container>
        <Header>
          <HeaderMain>
            <Major>{masteredDegree && masteredDegree.name}</Major>
            <Disclaimer>
              <Underline>Disclaimer:</Underline> This page is <Underline>not</Underline> a degree audit and should not
              be treated like one. <ActionableText>Click here for more info.</ActionableText>
            </Disclaimer>
          </HeaderMain>
          <HeaderRight>
            <Credits>
              {degree.completedCredits()}/{degree.totalCredits()} credits
            </Credits>
            <Percentage>{degree.percentComplete().toFixed(2)}% complete</Percentage>
            <ActionableText onClick={this.handleChangeDegree}>Click here to change degree!</ActionableText>
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
        <Modal title="Pick a major!" open={this.state.majorModalOpen} onBlurCancel={this.handleMajorBlur}>
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
      </Container>
    );
  }
}
