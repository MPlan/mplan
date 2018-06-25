import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';
import { Text } from 'components/text';
import { ActionableText } from 'components/actionable-text';

const Container = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
  padding: ${styles.space(0)};
  margin: ${styles.space(0)};
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(0)};
`;
const Summary = styled(View)`
  min-width: 12rem;
  margin-right: ${styles.space(0)};
`;
const SimpleName = styled(Text)`
  font-weight: bold;
  /* margin-bottom: ${styles.space(-1)}; */
  font-size: ${styles.space(1)};
`;
const FullName = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const CreditHours = styled(Text)``;
const Description = styled(View)``;

interface CourseProps {
  course: Model.Course;
}
interface CourseState {
  showMore: boolean;
}

export class Course extends React.PureComponent<CourseProps, CourseState> {
  constructor(props: CourseProps) {
    super(props);
    this.state = {
      showMore: false,
    };
  }

  get description() {
    return this.props.course.description || '';
  }

  get shortDescription() {
    return this.description
      .split(' ')
      .slice(0, 40)
      .join(' ');
  }

  get activeDescription() {
    return this.state.showMore ? this.description : this.shortDescription;
  }

  get showShowMore() {
    return this.description !== this.shortDescription && !this.state.showMore;
  }

  get showShowLess() {
    return this.description !== this.shortDescription && this.state.showMore;
  }

  get creditHours() {
    const { course } = this.props;
    const _min = course.creditHoursMin;
    const _max = course.creditHours;

    const min = _min || _max;
    const max = _max || _min;

    if (max === undefined) return '';
    if (min !== max) return `${min} - ${max} credit hours`;
    return `${max} credit hours`;
  }

  handleShowMore = () => {
    this.setState(previousState => ({
      ...previousState,
      showMore: true,
    }));
  };

  handleShowLess = () => {
    this.setState(previousState => ({
      ...previousState,
      showMore: false,
    }));
  };

  render() {
    const { course } = this.props;
    return (
      <Container>
        <Summary>
          <SimpleName>{course.simpleName}</SimpleName>
          <FullName>{course.name}</FullName>
          <CreditHours>{this.creditHours}</CreditHours>
        </Summary>
        <Description>
          <Text>{this.activeDescription}</Text>
          {this.showShowMore && (
            <ActionableText onClick={this.handleShowMore}>Show more</ActionableText>
          )}
          {this.showShowLess && (
            <ActionableText onClick={this.handleShowLess}>Show less</ActionableText>
          )}
        </Description>
      </Container>
    );
  }
}
