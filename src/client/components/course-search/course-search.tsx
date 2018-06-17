import * as React from 'react';
import * as Model from 'models';
import * as Immutable from 'immutable';
import * as styles from 'styles';
import styled from 'styled-components';
import { View } from 'components/view';
import { Text } from 'components/text';
import { CourseSearchItem } from 'components/course-search-item';
import { Button } from 'components/button';
import { Fa } from 'components/fa';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

const INPUT_DEBOUNCE_TIME = 250;

const Container = styled(View)`
  width: 50rem;
  max-height: 80vh;
`;
const SearchHalf = styled(View)`
  flex: 1;
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
  & > * {
    flex-shrink: 0;
  }
  margin-bottom: ${styles.space(0)};
`;
const Count = styled(Text)``;
const CurrentList = styled(View)`
  flex: 1;
`;
const CurrentListLabel = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const Split = styled(View)`
  flex: 1;
  flex-direction: row;
`;
const ButtonRow = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  flex-shrink: 0;
`;

export interface CourseSearchProps {
  searchResults: Model.SearchResults;
  currentCourses: Model.Course[];
  onChangeCourses: (courses: Model.Course[]) => void;
  onCancel: () => void;
  onSearch: (query: string) => void;
}

export interface CourseSearchState {
  searchResults: Model.SearchResults;
  currentCourses: Model.Course[];
}

export class CourseSearch extends React.PureComponent<CourseSearchProps, CourseSearchState> {
  input$ = new Subject<string>();
  subscription: Subscription | undefined;
  htmlForId = uuid();

  constructor(props: CourseSearchProps) {
    super(props);
    this.state = {
      searchResults: Immutable.Seq([]),
      currentCourses: [],
    };
  }

  componentDidMount() {
    this.subscription = this.input$
      .pipe(debounceTime(INPUT_DEBOUNCE_TIME))
      .subscribe(this.props.onSearch);
  }

  static getDerivedStateFromProps(nextProps: CourseSearchProps, previousState: CourseSearchState) {
    return {
      ...previousState,
      currentCourse: nextProps.currentCourses,
    };
  }

  componentWillUnmount() {
    this.subscription && this.subscription.unsubscribe();
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.input$.next(value);
  };

  handleAddClick(courseToAdd: Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      currentCourses: [...previousState.currentCourses, courseToAdd],
    }));
  }

  handleDeleteClick(courseToDelete: Model.Course) {
    this.setState(previousState => ({
      ...previousState,
      currentCourses: previousState.currentCourses.filter(
        course => course.id !== courseToDelete.id,
      ),
    }));
  }

  handleSaveClick = () => {
    this.props.onChangeCourses([...this.state.currentCourses]);
  };

  render() {
    const takeAway = 20;
    const top = this.state.searchResults.take(takeAway);
    const totalCount = this.state.searchResults.count;
    const count = this.props.searchResults.count() - top.count();
    return (
      <Container>
        <Split>
          <SearchHalf>
            <Form>
              <SearchLabel htmlFor={this.htmlForId}>Search for a course...</SearchLabel>
              <Search
                id={this.htmlForId}
                onChange={this.handleChange}
                placeholder="e.g. MATH 115 or Operating systems"
              />
            </Form>
            <SearchResults>
              {top.map(course => (
                <CourseSearchItem
                  key={course.id}
                  course={course}
                  onClick={() => this.handleAddClick(course)}
                />
              ))}
            </SearchResults>
            <Count>
              {count > 0
                ? `Showing first ${takeAway} results of ${totalCount}. Refine your search to see more.`
                : `${totalCount} results.`}
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
    );
  }
}
