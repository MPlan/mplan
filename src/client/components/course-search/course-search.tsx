import * as React from 'react';
import * as Model from 'models';
import * as uuid from 'uuid/v4';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Button } from 'components/button';
import { Fa } from 'components/fa';
import { Modal } from 'components/modal';

import { CourseSearchItem } from './course-search-item';

const INPUT_DEBOUNCE_TIME = 250;

const Container = styled(View)`
  max-height: 80vh;
`;
const SearchHalf = styled(View)`
  flex: 1 0 50%;
`;
const Form = styled.form`
  margin-right: ${styles.space(0)};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-bottom: ${styles.space(0)};
`;
const Search = styled.input`
  padding: ${styles.space(-1)};
  font-family: ${styles.fontFamily};
`;
const SearchLabel = styled.label`
  margin-bottom: ${styles.space(-1)};
  font-family: ${styles.fontFamily};
  color: ${styles.text};
`;
const SearchResults = styled(View)`
  overflow: auto;
  flex: 1 1 auto;
  margin-bottom: ${styles.space(0)};
`;
const Count = styled(Text)``;
const CurrentList = styled(View)`
  flex: 1 0 50%;
`;
const CurrentListLabel = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const Split = styled(View)`
  flex: 1 1 auto;
  flex-direction: row;
`;
const ButtonRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  flex-shrink: 0;
  & ${Button} {
    margin-left: ${styles.space(0)};
  }
`;

export interface CourseSearchProps {
  title: string;
  open: boolean;
  defaultCourses: Model.Course[];
  searchResults: Model.Course[];
  totalMatches: number;
  onSearch: (query: string) => void;
  onCancel: () => void;
  onSaveCourses: (course: Model.Course[]) => void;
}

export interface CourseSearchState {
  open: boolean;
  currentCourses: Model.Course[];
}

class _CourseSearch extends React.PureComponent<CourseSearchProps, CourseSearchState> {
  input$ = new Subject<string>();
  subscription: Subscription | undefined;
  htmlForId = uuid();

  constructor(props: CourseSearchProps) {
    super(props);
    this.state = {
      open: props.open,
      currentCourses: props.defaultCourses,
    };
  }

  static getDerivedStateFromProps(nextProps: CourseSearchProps, previousState: CourseSearchProps) {
    const nextState = { ...previousState, open: nextProps.open };
    const wasClosedBefore = !previousState.open;
    const isOpenNow = nextProps.open;

    if (wasClosedBefore && isOpenNow) {
      return {
        ...nextState,
        currentCourses: nextProps.defaultCourses,
      };
    }

    return nextState;
  }

  componentDidMount() {
    this.subscription = this.input$
      .pipe(debounceTime(INPUT_DEBOUNCE_TIME))
      .subscribe(this.props.onSearch);
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.input$.next(value);
  };

  handleAddClick = (courseToAdd: Model.Course) => {
    this.setState(previousState => {
      const courseAlreadyAdded = !!previousState.currentCourses.find(
        course => course.catalogId === courseToAdd.catalogId,
      );

      if (courseAlreadyAdded) {
        return {
          ...previousState,
          currentCourses: previousState.currentCourses.filter(
            currentCourse => currentCourse.catalogId !== courseToAdd.catalogId,
          ),
        };
      }

      return {
        ...previousState,
        currentCourses: [...previousState.currentCourses, courseToAdd],
      };
    });
  };

  handleDeleteClick = (courseToDelete: Model.Course) => {
    this.setState(previousState => ({
      ...previousState,
      currentCourses: previousState.currentCourses.filter(
        course => course.id !== courseToDelete.id,
      ),
    }));
  };

  handleSaveClick = () => {
    this.props.onSaveCourses([...this.state.currentCourses]);
  };

  render() {
    return (
      <Modal
        title={this.props.title}
        open={this.state.open}
        onBlurCancel={this.props.onCancel}
        size="extra-large"
      >
        <Container>
          <Split>
            <SearchHalf>
              <Form onSubmit={this.handleSubmit}>
                <SearchLabel htmlFor={this.htmlForId}>Search for a course...</SearchLabel>
                <Search
                  id={this.htmlForId}
                  onChange={this.handleSearchChange}
                  placeholder="e.g. MATH 115 or Operating systems"
                />
              </Form>
              <SearchResults>
                {this.props.searchResults.map(course => (
                  <CourseSearchItem
                    key={course.id}
                    course={course}
                    onClick={() => this.handleAddClick(course)}
                    added={
                      !!this.state.currentCourses.find(
                        currentCourse => currentCourse.catalogId === course.catalogId,
                      )
                    }
                  />
                ))}
              </SearchResults>
              <Count>
                {this.props.searchResults.length !== this.props.totalMatches
                  ? `Showing first ${this.props.searchResults.length} results of ${
                      this.props.totalMatches
                    }. Refine your search to see more.`
                  : `${this.props.searchResults.length} results.`}
              </Count>
            </SearchHalf>

            <CurrentList>
              <CurrentListLabel>Current courses:</CurrentListLabel>
              <SearchResults>
                {this.state.currentCourses.map(course => (
                  <CourseSearchItem
                    key={course.id}
                    course={course}
                    delete
                    onClick={() => this.handleDeleteClick(course)}
                  />
                ))}
              </SearchResults>
            </CurrentList>
          </Split>
          <ButtonRow>
            <Button onClick={this.props.onCancel}>
              <Fa icon="times" />
              <Text style={{ marginLeft: styles.space(-1) }}>Cancel</Text>
            </Button>
            <Button onClick={this.handleSaveClick}>
              <Fa icon="check" />
              <Text style={{ marginLeft: styles.space(-1) }}>Save</Text>
            </Button>
          </ButtonRow>
        </Container>
      </Modal>
    );
  }
}

export const CourseSearch = (_CourseSearch as any) as React.ComponentType<CourseSearchProps>;
