import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';
import * as styles from 'styles';
import { history } from 'client/history';

import { Link } from 'react-router-dom';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Button } from 'components/button';
import { Prerequisite } from 'components/prerequisite';
import { PreferredPrerequisite } from 'components/preferred-prerequisite';
import { ActionableText } from 'components/actionable-text';
import { Fa } from 'components/fa';
import { PrerequisiteEditor } from 'components/prerequisite-editor';

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
const StyledLink = styled(Link)`
  cursor: pointer;
  color: ${styles.link};
  text-decoration: none;
  &:hover {
    color: ${styles.linkHover};
    text-decoration: underline;
  }
  &:active {
    color: ${styles.linkActive};
  }
`;
const EditPrerequisites = styled(ActionableText)`
  margin: ${styles.space(-1)} 0;
`;

interface CourseDetailProps {
  course: Model.Course | undefined;
}
interface CourseDetailState {
  prerequisiteEditorOpen: boolean;
}

class CourseDetail extends React.PureComponent<CourseDetailProps, CourseDetailState> {
  constructor(props: CourseDetailProps) {
    super(props);
    this.state = {
      prerequisiteEditorOpen: false,
    };
  }

  handleBackClick = () => {
    history.goBack();
  };

  handleEditPrerequisites = () => {
    this.setState(previousState => ({
      ...previousState,
      prerequisiteEditorOpen: true,
    }));
  };

  handlePrerequisiteEditorClose = () => {
    this.setState(previousState => ({
      ...previousState,
      prerequisiteEditorOpen: false,
    }));
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
        <Row>
          <Button onClick={this.handleBackClick}>
            <Icon icon="arrowLeft" />
            Back
          </Button>
        </Row>
        <Header>
          <Title>{course.simpleName}</Title>
          <FullName>{course.name}</FullName>
        </Header>
        <Row>
          <Text>{course.creditHoursFullString}</Text>
        </Row>
        <Row>
          <Text>{course.description}</Text>
        </Row>
        <Row>
          <Key>Previous instructors:</Key>
          <Text>{course.historicallyTaughtBy().join(', ')}</Text>
        </Row>
        {course.prerequisitesConsideringOverrides && (
          <Row>
            <Key>Preferred prerequisites:</Key>
            <PreferredPrerequisite course={course} />
          </Row>
        )}
        {!!course.prerequisiteOverrideType && <Text>Override applied</Text>}
        {course.prerequisitesConsideringOverrides && (
          <Row>
            <Key>Prerequisites:</Key>
            <View>
              <Text>Take:</Text>
              <Prerequisite prerequisite={course.prerequisitesConsideringOverrides} />
              {course.prerequisitesContainConcurrent() ? (
                <Text small>* can be taken concurrently</Text>
              ) : null}
            </View>
          </Row>
        )}
        <EditPrerequisites onClick={this.handleEditPrerequisites}>
          Edit prerequisites
        </EditPrerequisites>
        {course.corequisites && (
          <Row>
            <Key>Corequisites:</Key>
            <Text>
              {course.corequisites
                .map(([subjectCode, courseNumber]) => `${subjectCode} ${courseNumber}`)
                .join(', ')}
            </Text>
          </Row>
        )}
        {course.crossList && (
          <Row>
            <Key>Cross-listed with:</Key>
            <Text>
              {course.crossList.map(([subjectCode, courseNumber]) => (
                <React.Fragment key={`${subjectCode} ${courseNumber}`}>
                  <StyledLink to={`/catalog/${subjectCode}/${courseNumber}`}>
                    {subjectCode} {courseNumber}
                  </StyledLink>{' '}
                </React.Fragment>
              ))}
            </Text>
          </Row>
        )}
        <PrerequisiteEditor
          course={course}
          open={this.state.prerequisiteEditorOpen}
          onClose={this.handlePrerequisiteEditorClose}
        />
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
