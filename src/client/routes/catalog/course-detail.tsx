import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Page } from 'components/page';
import { Button } from 'components/button';
import { Fa } from 'components/fa';
import { history } from '../../app';

const Container = styled(View)``;
const Row = styled(View)`
  flex-direction: row;
`;
const Icon = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;

interface CourseDetailProps {
  course: Model.Course | undefined;
}
interface CourseDetailState {}

class CourseDetail extends React.PureComponent<CourseDetailProps, CourseDetailState> {
  handleBackClick = () => {
    history.push('/catalog');
  };
  renderSubtitle = () => {
    const { course } = this.props;
    if (!course) return null;
    return <Text>Course details for {course.name}</Text>;
  };
  render() {
    const { course } = this.props;
    if (!course) return null;
    return (
      <Page title={course.simpleName} renderSubtitle={this.renderSubtitle}>
        <Row>
          <Button onClick={this.handleBackClick}>
            <Icon icon="arrowLeft" />Back
          </Button>
        </Row>
      </Page>
    );
  }
}

interface CourseContainerProps {
  subjectCode: string;
  courseNumber: string;
}

const container = Model.store.connect({
  scopeTo: store => store.catalog,
  mapStateToProps: (
    catalog: Model.Catalog,
    { subjectCode, courseNumber }: CourseContainerProps,
  ) => {
    return {
      course: catalog.getCourse(subjectCode, courseNumber),
    };
  },
  mapDispatchToProps: () => {
    return {};
  },
})(CourseDetail);

export { container as CourseDetail };
