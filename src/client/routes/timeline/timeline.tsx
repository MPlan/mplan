import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { SortEndHandler } from 'react-sortable-hoc';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Page } from 'components/page';
import { FloatingActionButton } from 'components/floating-action-button';
import { Button } from 'components/button';
import { ActionableText } from 'components/actionable-text';
import { Modal } from 'components/modal';
import { Checkbox } from 'components/checkbox';
import { Reorder } from 'components/reorder';

import { Toolbox } from './components/toolbox';
import { Semester } from './components/semester';

const Container = styled(View)`
  flex-direction: row;
  flex: 1 1 auto;
`;
const Content = styled(View)`
  flex: 1 1 auto;
  position: relative;
  overflow: auto;
`;
const SemestersContainer = styled(View)`
  flex: 1 1 auto;
  flex-direction: row;
  overflow-y: auto;
  overflow-x: scroll;
  padding-bottom: ${styles.space(1)};

  & > *:first-child {
    margin-left: ${styles.space(1)};
  }
  &::-webkit-scrollbar {
    -webkit-appearance: none;
    height: ${styles.space(1)};
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 3px;
    background-color: ${styles.blue};
    -webkit-box-shadow: 0 0 1px rgba(255, 255, 255, 0.5);
    top: 100%;
  }
`;
const Navigator = styled.div`
  background-color: ${styles.grayLighter};
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  position: relative;
  flex: 0 0 auto;
`;
const NavigationLabel = styled(Text)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  color: ${styles.gray};
  font-size: ${styles.space(-1)};
  cursor: pointer;
  position: relative;
  flex: 1 1 auto;
  &:hover {
    text-decoration: underline;
    color: ${styles.hover(styles.gray)};
    background-color: ${styles.hover(styles.grayLight)};
  }
  &:active {
    color: ${styles.active(styles.gray)};
    background-color: ${styles.active(styles.grayLight)};
  }
  padding: ${styles.space(-1)};
`;
const ScheduleForm = styled.form``;
const ReorderSemester = styled(View)`
  padding: ${styles.space(0)} ${styles.space(1)};
`;

const actions = {
  newSemester: {
    text: 'New semester',
    icon: 'plus',
    color: styles.blue,
  },
  reorder: {
    text: 'Reorder semesters',
    icon: 'bars',
  },
};

export interface TimelineProps {
  semesters: Model.Semester[];
  onCreateNewSemester: () => void;
  onGeneratePlan: (planOptions: Model.PlanOptions) => void;
  onReorderSemesters: SortEndHandler;
}

export interface TimelineState {
  sliderWidth: number;
  sliderLeft: number;
  scheduleModelOpen: boolean;
  reorderingSemesters: boolean;
}

export class Timeline extends React.PureComponent<TimelineProps, TimelineState> {
  constructor(props: TimelineProps) {
    super(props);
    this.state = {
      sliderWidth: 0,
      sliderLeft: 0,
      scheduleModelOpen: false,
      reorderingSemesters: false,
    };
  }

  semesterContainerRef: HTMLElement | null | undefined;

  handleActions = (action: keyof typeof actions) => {
    if (action === 'newSemester') {
      this.props.onCreateNewSemester();
      return;
    }

    if (action === 'reorder') {
      this.handleOpenSemesterReorder();
      return;
    }
  };

  handleNavigationClick(semester: Model.Semester) {
    const semesterElement = document.querySelector(`.semester-${semester.id}`);
    if (!semesterElement) return;
    semesterElement.scrollIntoView({ behavior: 'smooth' });
  }

  handleGenerateClick = () => {
    this.setState(previousState => ({
      ...previousState,
      scheduleModelOpen: true,
    }));
  };
  handleScheduleModalBlur = () => {
    this.setState(previousState => ({
      ...previousState,
      scheduleModelOpen: false,
    }));
  };

  handleScheduleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const creditHourCapElement = formElement.querySelector('.credit-hour-cap') as HTMLInputElement;
    const considerSummerClassesElement = formElement.querySelector(
      '.consider-summer-classes',
    ) as HTMLInputElement;
    const considerHistoricalDataElement = formElement.querySelector(
      '.consider-historical-data',
    ) as HTMLInputElement;

    const creditHourCap = parseInt(creditHourCapElement.value, 10);
    const includeSummerCourses = considerSummerClassesElement.checked;
    const considerHistoricalData = considerHistoricalDataElement.checked;

    this.props.onGeneratePlan({
      considerHistoricalData,
      creditHourCap,
      includeSummerCourses,
      startFromSeason: 'Winter',
      startFromYear: 2018,
    });
  };

  handleOpenSemesterReorder = () => {
    this.setState(previousState => ({
      ...previousState,
      reorderingSemesters: true,
    }));
  };

  handleCloseSemesterReorder = () => {
    this.setState(previousState => ({
      ...previousState,
      reorderingSemesters: false,
    }));
  };

  renderSubtitle = () => {
    return <Text color={styles.textLight}>Create your MPlan here.</Text>;
  };

  renderTitleLeft = () => {
    return (
      <View>
        <Text strong color={styles.textLight}>
          Expected Graduation:
        </Text>
        <Text strong large color={styles.textLight}>
          April 2018
        </Text>
        <ActionableText onClick={this.handleGenerateClick}>Generate schedule...</ActionableText>
      </View>
    );
  };

  renderSemesterReorder = (semester: Model.Semester) => {
    const courses = semester.courseArray();
    return (
      <ReorderSemester>
        <Text>
          {courses.length <= 0
            ? 'Empty semester'
            : semester
                .courseArray()
                .map(course => course.simpleName)
                .join(', ')}
        </Text>
      </ReorderSemester>
    );
  };

  render() {
    return (
      <Container>
        <Content>
          <Page
            title="Timeline"
            renderSubtitle={this.renderSubtitle}
            renderTitleLeft={this.renderTitleLeft}
          >
            <SemestersContainer className="semesters-container">
              {this.props.semesters.map(semester => (
                <Semester
                  key={semester.id}
                  semester={semester}
                  onReorder={this.handleOpenSemesterReorder}
                />
              ))}
            </SemestersContainer>
            <Navigator>
              {this.props.semesters.map(semester => (
                <NavigationLabel
                  key={semester.id}
                  onClick={() => this.handleNavigationClick(semester)}
                >
                  {semester.shortName}
                </NavigationLabel>
              ))}
            </Navigator>
            <FloatingActionButton
              actions={actions}
              message="Add..."
              onAction={this.handleActions}
            />
          </Page>
        </Content>
        <Toolbox />
        <Modal
          title="Generate schedule... "
          open={this.state.scheduleModelOpen}
          onBlurCancel={this.handleScheduleModalBlur}
        >
          <ScheduleForm onSubmit={this.handleScheduleFormSubmit}>
            <label>
              Start from semester:
              <input className="schedule-start" type="text" />
            </label>
            <label>
              Credit hour cap:
              <input className="credit-hour-cap" type="number" defaultValue="15" />
            </label>
            <Checkbox className="consider-summer-classes" label="consider summer classes" />
            <Checkbox className="consider-historical-data" label="consider historical data" />
            <Button type="submit">Generate schedule...</Button>
          </ScheduleForm>
        </Modal>
        <Reorder
          title="Reordering semesters..."
          open={this.state.reorderingSemesters}
          elements={this.props.semesters}
          onClose={this.handleCloseSemesterReorder}
          render={this.renderSemesterReorder}
          onReorder={this.props.onReorderSemesters}
        />
      </Container>
    );
  }
}
