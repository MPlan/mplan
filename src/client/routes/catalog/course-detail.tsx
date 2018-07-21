import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';
import * as styles from 'styles';
import { history } from 'client/history';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Button } from 'components/button';
import { Fa } from 'components/fa';

const Container = styled(View)`
  margin: auto;
  padding: ${styles.space(1)};
  max-width: 40rem;
`;
const Row = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(0)};
`;
const Icon = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;
const Header = styled(View)`
  flex: 0 0 auto;
  margin-bottom: ${styles.space(0)};
`;
const Title = styled(Text)`
  flex: 0 0 auto;
  color: ${styles.textLight};
  font-weight: bold;
  font-size: ${styles.space(3)};
`;
const FullName = styled(Text)`
  flex: 0 0 auto;
  color: ${styles.textLight};
  font-weight: ${styles.bold};
  font-size: ${styles.space(2)};
`;
const Key = styled(Text)`
  font-weight: bold;
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
    return <Text color={styles.textLight}>Course details for {course.name}</Text>;
  };
  render() {
    const { course } = this.props;
    if (!course) return null;
    return (
      <Container>
        <Header>
          <Title>{course.simpleName}</Title>
          <FullName>{course.name}</FullName>
        </Header>
        <Row>
          <Text>{course.creditHoursString}</Text>
        </Row>
        <Row>
          <Button onClick={this.handleBackClick}>
            <Icon icon="arrowLeft" />Back
          </Button>
        </Row>
        <Row>
          <Text>{course.description}</Text>
        </Row>
        <Row>
          <Key>Previous instructors:</Key>
          <Text>{course.historicallyTaughtBy().join(', ')}</Text>
        </Row>
      </Container>
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
