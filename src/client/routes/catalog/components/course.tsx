import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';
import * as styles from 'styles';

import { View } from 'components/view';
import { Text } from 'components/text';
import { ActionableText } from 'components/actionable-text';
import { Fa } from 'components/fa';

const SimpleName = styled(Text)`
  font-weight: bold;
  /* margin-bottom: ${styles.space(-1)}; */
  font-size: ${styles.space(1)};
`;
const Root = styled(View)`
  cursor: pointer;
  flex-direction: row;
  padding: ${styles.space(0)};
  margin: ${styles.space(0)};
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(0)};
  &:hover {
    box-shadow: ${styles.boxShadow(1)};
  }
  &:active {
    box-shadow: ${styles.boxShadow(-1)};
  }
  &:hover ${SimpleName} {
    text-decoration: underline;
  }
  transition: all 200ms;
`;
const Summary = styled(View)`
  flex: 0 1 auto;
  min-width: 12rem;
  margin-right: ${styles.space(0)};
`;
const FullName = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const CreditHours = styled(Text)``;
const Description = styled(View)`
  flex: 1 1 auto;
  margin-right: ${styles.space(0)};
`;
const ArrowContainer = styled(View)``;

interface CourseProps {
  course: Model.Course.Model;
  onClick: () => void;
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

  handleClick = (e: React.MouseEvent<Element>) => {
    const target = e.target;
    if (!target) return;
    const targetElement = target as Element;
    if (!targetElement.classList) return;
    if (targetElement.classList.contains('show-more-less')) return;

    this.props.onClick();
  };

  render() {
    const { course } = this.props;
    return (
      <Root onClick={this.handleClick}>
        <Summary>
          <SimpleName>{Model.Course.getSimpleName(course)}</SimpleName>
          <FullName>{course.name}</FullName>
          <CreditHours>{Model.Course.getCreditHoursFullString(course)}</CreditHours>
        </Summary>
        <Description>
          <Text>{this.activeDescription}</Text>
          {this.showShowMore && (
            <ActionableText className="show-more-less" onClick={this.handleShowMore}>
              Show more
            </ActionableText>
          )}
          {this.showShowLess && (
            <ActionableText className="show-more-less" onClick={this.handleShowLess}>
              Show less
            </ActionableText>
          )}
        </Description>
        <ArrowContainer>
          <Fa icon="chevronRight" />
        </ArrowContainer>
      </Root>
    );
  }
}
