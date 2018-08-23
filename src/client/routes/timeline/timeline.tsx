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
const Form = styled.form`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
`;
const ReorderSemester = styled(View)`
  padding: ${styles.space(0)} ${styles.space(1)};
`;
const Actions = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  & ${Button} {
    margin-left: ${styles.space(0)};
  }
  margin-top: ${styles.space(-1)};
`;
const AnchorDescription = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const AnchorYearInput = styled.input`
  font-family: ${styles.fontFamily};
  padding: ${styles.space(-1)};
  margin-left: ${styles.space(0)};
`;
const AnchorYearLabel = styled.label`
  font-family: ${styles.fontFamily};
  margin-bottom: ${styles.space(-1)};
  font-weight: bold;
`;
const AnchorRadioRow = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(-1)};
`;
const AnchorSemesterRadioLabel = styled.label`
  font-family: ${styles.fontFamily};
  flex: 1 1 auto;
`;
const AnchorSemesterRadio = styled.input`
  margin-right: ${styles.space(-1)};
  font-family: ${styles.fontFamily};
`;
const StartingSeason = styled(Text)`
  margin-right: ${styles.space(-1)};
  font-weight: bold;
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
  anchor: {
    text: 'Change plan starting point',
    icon: 'play',
  },
};

export interface TimelineProps {
  semesters: Model.Semester[];
  onCreateNewSemester: () => void;
  onGeneratePlan: (planOptions: Model.PlanOptions) => void;
  onReorderSemesters: SortEndHandler;
  onChangeAnchor: (year: number, season: 'fall' | 'winter' | 'summer') => void;
  anchorYear: number;
  anchorSeason: 'fall' | 'winter' | 'summer';
}

export interface TimelineState {
  sliderWidth: number;
  sliderLeft: number;
  scheduleModelOpen: boolean;
  reorderingSemesters: boolean;
  anchorModalOpen: boolean;
}

export class Timeline extends React.PureComponent<TimelineProps, TimelineState> {
  constructor(props: TimelineProps) {
    super(props);
    this.state = {
      sliderWidth: 0,
      sliderLeft: 0,
      scheduleModelOpen: false,
      reorderingSemesters: false,
      anchorModalOpen: false,
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

    if (action === 'anchor') {
      this.handleOpenChangeAnchor();
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

  handleOpenChangeAnchor = () => {
    this.setState(previousState => ({
      ...previousState,
      anchorModalOpen: true,
    }));
  };

  handleCloseChangeAnchor = () => {
    this.setState(previousState => ({
      ...previousState,
      anchorModalOpen: false,
    }));
  };

  handleAnchorSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const yearElement = document.querySelector('.anchor-year') as HTMLInputElement | null;
    if (!yearElement) return;
    const fallElement = document.querySelector('.anchor-fall') as HTMLInputElement | null;
    if (!fallElement) return;
    const winterElement = document.querySelector('.anchor-winter') as HTMLInputElement | null;
    if (!winterElement) return;
    const summerElement = document.querySelector('.anchor-summer') as HTMLInputElement | null;
    if (!summerElement) return;

    const year = parseInt(yearElement.value, 10);
    const season = fallElement.checked
      ? 'fall'
      : winterElement.checked
        ? 'winter'
        : summerElement.checked
          ? 'summer'
          : undefined;

    if (!year) return;
    if (!season) return;

    this.handleCloseChangeAnchor();
    this.props.onChangeAnchor(year, season);
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
              message="Actions..."
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
          <Form onSubmit={this.handleScheduleFormSubmit}>
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
          </Form>
        </Modal>
        {this.state.anchorModalOpen && (
          <Modal
            title="Changing plan starting point..."
            open
            onBlurCancel={this.handleCloseChangeAnchor}
            size="medium"
          >
            <Form onSubmit={this.handleAnchorSubmit}>
              <AnchorDescription>
                A plan's starting point is the year and semester you'd like to start your MPlan at.
                New semesters added to your plan will be based off this point.
              </AnchorDescription>
              <AnchorYearLabel>
                Starting Year:
                <AnchorYearInput
                  type="number"
                  className="anchor-year"
                  defaultValue={this.props.anchorYear.toString()}
                />
              </AnchorYearLabel>
              <AnchorRadioRow>
                <StartingSeason>Staring Season:</StartingSeason>
                <AnchorSemesterRadioLabel>
                  <AnchorSemesterRadio
                    type="radio"
                    name="semester-anchor"
                    className="anchor-fall"
                    defaultChecked={this.props.anchorSeason === 'fall'}
                  />
                  Fall
                </AnchorSemesterRadioLabel>
                <AnchorSemesterRadioLabel>
                  <AnchorSemesterRadio
                    type="radio"
                    name="semester-anchor"
                    className="anchor-winter"
                    defaultChecked={this.props.anchorSeason === 'winter'}
                  />
                  Winter
                </AnchorSemesterRadioLabel>
                <AnchorSemesterRadioLabel>
                  <AnchorSemesterRadio
                    type="radio"
                    name="semester-anchor"
                    className="anchor-summer"
                    defaultChecked={this.props.anchorSeason === 'summer'}
                  />
                  Summer
                </AnchorSemesterRadioLabel>
              </AnchorRadioRow>
              <Actions>
                <Button onClick={this.handleCloseChangeAnchor} type="button">
                  Cancel
                </Button>
                <Button>Save</Button>
              </Actions>
            </Form>
          </Modal>
        )}
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
