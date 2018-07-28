import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { history } from 'client/history';

import { View } from 'components/view';
import { Text } from 'components/text';
import { DropdownMenu } from 'components/dropdown-menu';
import { RightClickMenu, RightClickProps } from 'components/right-click-menu';

const Container = styled(View)`
  padding: ${styles.space(-1)} ${styles.space(0)};
  flex-direction: row;
  align-items: flex-start;
  position: relative;
  &:hover {
    box-shadow: ${styles.grabbableShadow};
    z-index: 15;
  }
  transition: all 0.2s;
  background-color: ${styles.white};
  &:active {
    box-shadow: ${styles.grabbableShadowActive};
  }
  .drag-mode & {
    box-shadow: none !important;
  }
`;
const Row = styled(View)`
  flex-direction: row;
  align-items: baseline;
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  margin-bottom: ${styles.space(-1)};
  margin-right: auto;
`;
const Credits = styled(Text)`
  margin-right: ${styles.space(-1)};
`;
const FullName = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const CriticalLevel = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const Body = styled(View)`
  flex: 1;
`;

export interface CourseProps {
  course: Model.Course;
  onDeleteCourse?: () => void;
}

export class Course extends React.PureComponent<CourseProps, {}> {
  actions = this.props.onDeleteCourse
    ? {
        view: { text: 'View in catalog', icon: 'chevronRight', color: styles.blue },
        delete: { text: 'Delete course', icon: 'trash', color: styles.red },
      }
    : {
        view: { text: 'View in catalog', icon: 'chevronRight', color: styles.blue },
      };

  handleAction = (action: string) => {
    const { course } = this.props;
    if (action === 'delete') {
      this.props.onDeleteCourse && this.props.onDeleteCourse();
    } else if (action === 'view') {
      history.push(`/catalog/${course.subjectCode}/${course.courseNumber}`);
    }
  };

  renderRightClickMenu = (rightClickProps: RightClickProps) => {
    const { course } = this.props;
    const criticalLevel = course.criticalLevel();

    return (
      <Container {...rightClickProps}>
        <Body>
          <Row>
            <SimpleName>{course.simpleName}</SimpleName>
            <Credits small>
              {course.creditHoursFullString}
            </Credits>
          </Row>
          <FullName>{course.name}</FullName>
          <CriticalLevel small>Critical level: {criticalLevel}</CriticalLevel>
        </Body>
        <DropdownMenu
          header={course.simpleName}
          actions={this.actions}
          onAction={this.handleAction}
        />
      </Container>
    );
  };

  render() {
    return (
      <RightClickMenu
        header={this.props.course.simpleName}
        actions={this.actions}
        onAction={this.handleAction}
        render={this.renderRightClickMenu}
      />
    );
  }
}
