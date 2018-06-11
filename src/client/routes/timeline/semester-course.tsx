import * as React from 'react';
import * as Model from 'models';
import { View } from 'components/view';
import { Text } from 'components/text';
import styled from 'styled-components';
import * as styles from 'styles';
import { DropdownMenu } from 'components/dropdown-menu';
import { RightClickMenu } from 'components/right-click-menu';

const Container = styled(View)`
  padding: ${styles.space(-1)} ${styles.space(0)};
  flex-direction: row;
  align-items: flex-start;
  position: relative;
  &:hover {
    box-shadow: 0 0.1rem 1rem 0 rgba(12, 0, 51, 0.15);
    z-index: 15;
  }
  transition: all 0.2s;
  background-color: ${styles.white};
  &:active {
    box-shadow: 0 0.2rem 1.3rem 0 rgba(12, 0, 51, 0.2);
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

export interface SemesterCourseProps {
  course: Model.Course;
  onDeleteCourse?: () => void;
}

export function SemesterCourse(props: SemesterCourseProps) {
  const { course, onDeleteCourse } = props;
  const criticalLevel = course.criticalLevel();

  function handleAction(action: string) {
    if (action === 'delete') {
      onDeleteCourse && onDeleteCourse();
    }
  }

  const actions = onDeleteCourse
    ? {
        view: { text: 'View in catalog', icon: 'chevronRight', color: styles.blue },
        delete: { text: 'Delete course', icon: 'trash', color: styles.red },
      }
    : {
        view: { text: 'View in catalog', icon: 'chevronRight', color: styles.blue },
      };

  return (
    <RightClickMenu header={course.simpleName} actions={actions} onAction={handleAction}>
      <Container>
        <Body>
          <Row>
            <SimpleName>{course.simpleName}</SimpleName>
            <Credits small>
              {course.credits} {course.credits === 1 ? 'credit' : 'credits'}
            </Credits>
          </Row>
          <FullName>{course.name}</FullName>
          <CriticalLevel small>Critical level: {criticalLevel}</CriticalLevel>
        </Body>
        <DropdownMenu header={course.simpleName} actions={actions} onAction={handleAction} />
      </Container>
    </RightClickMenu>
  );
}
