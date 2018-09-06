import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';
import { DegreeItem } from './degree-item';

const Columns = styled(View)`
  flex-direction: row;
  padding: 0 ${styles.space(0)};
  & > :not(:last-child) {
    margin-right: ${styles.space(0)};
  }
`;
const Column = styled(View)`
  flex: 1 0 33%;
`;
const ColumnHeader = styled(Text)`
  font-weight: bold;
  margin: 0 ${styles.space(-1)};
  margin-bottom: ${styles.space(-1)};
`;
const CourseGroup = styled(Text)`
  padding: ${styles.space(-1)};
  margin-bottom: ${styles.space(-1)};
  &:hover {
    box-shadow: ${styles.boxShadow(-1)};
  }
`;
const FaRight = styled(Fa)`
  margin-left: ${styles.space(-1)};
`;

interface CourseGroupSummaryProps {}

export class CourseGroupSummary extends React.PureComponent<CourseGroupSummaryProps, {}> {
  render() {
    return (
      <DegreeItem title="Course groups">
        <Columns>
          <Column>
            <ColumnHeader>Column one</ColumnHeader>
            <CourseGroup>Written and Oral Communication <FaRight icon="angleRight"/></CourseGroup>
            <CourseGroup>Humanities and the Arts</CourseGroup>
            <CourseGroup>Social and Behavior Analysis</CourseGroup>
          </Column>
          <Column>
            <ColumnHeader>Column two</ColumnHeader>
            <CourseGroup>Mathematics and Statistics</CourseGroup>
            <CourseGroup>Laboratory Science</CourseGroup>
            <CourseGroup>Additional Science</CourseGroup>
            <CourseGroup>Business Courses</CourseGroup>
          </Column>
          <Column>
            <ColumnHeader>Column three</ColumnHeader>
            <CourseGroup>CIS Courses</CourseGroup>
            <CourseGroup>Required Courses for SE</CourseGroup>
            <CourseGroup>Application Sequence</CourseGroup>
            <CourseGroup>Technical Electives</CourseGroup>
            <CourseGroup>General Electives</CourseGroup>
          </Column>
        </Columns>
      </DegreeItem>
    );
  }
}
