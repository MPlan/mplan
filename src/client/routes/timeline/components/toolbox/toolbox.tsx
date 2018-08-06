import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Accordion } from 'components/accordion';
import { Dropzone, SortChange } from 'components/dropzone';
import { Course } from '../course';

const Container = styled(View)`
  box-shadow: ${styles.boxShadow(0)};
  width: 16rem;
  background-color: ${styles.white};
  transition: all 200ms;
  max-width: 16rem;
  z-index: 2;
  overflow: hidden;
`;
const Header = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin: ${styles.space(0)};
`;
const Body = styled(View)`
  flex: 1 1 auto;
`;
const Warning = styled(View)`
  padding: ${styles.space(-1)};
`;

export interface ToolboxProps {
  plan: Model.Plan;
  showToolbox: boolean;
  onChangeSort: (sortChange: SortChange) => void;
}

export interface ToolboxState {
  unplacedCoursesOpen: boolean;
  warningsOpen: boolean;
}

export class Toolbox extends React.PureComponent<ToolboxProps, ToolboxState> {
  constructor(props: ToolboxProps) {
    super(props);
    this.state = {
      unplacedCoursesOpen: true,
      warningsOpen: true,
    };
  }
  handleUnplacedCoursesToggle = () => {
    this.setState(previousState => ({
      ...previousState,
      unplacedCoursesOpen: !previousState.unplacedCoursesOpen,
    }));
  };

  handleWarningsToggle = () => {
    this.setState(previousState => ({
      ...previousState,
      warningsOpen: !previousState.warningsOpen,
    }));
  };

  // TODO
  handleDeleteCourse(_: Model.Course) {}

  renderCourse = (course: Model.Course) => {
    return <Course key={course.id} course={course} />;
  };

  render() {
    const plan = this.props.plan;
    return (
      <Container style={{ maxWidth: this.props.showToolbox ? '16rem' : 0 }}>
        <Header>Toolbox</Header>
        <Body>
          <Accordion
            header="Unplaced courses"
            onToggle={this.handleUnplacedCoursesToggle}
            open={this.state.unplacedCoursesOpen}
          >
            <Dropzone
              id={'unplaced-courses'}
              elements={plan.unplacedCourses()}
              getKey={course => course.id}
              onChangeSort={this.props.onChangeSort}
              render={this.renderCourse}
            />
          </Accordion>
          <Accordion
            header="Warnings"
            onToggle={this.handleWarningsToggle}
            open={this.state.warningsOpen}
          >
            {plan.warningsNotOfferedDuringSeason().map(warning => (
              <Warning key={warning}>
                <Text>{warning}</Text>
              </Warning>
            ))}
          </Accordion>
        </Body>
      </Container>
    );
  }
}
