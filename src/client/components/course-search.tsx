import * as React from 'react';
import * as Model from '../models';
import * as Immutable from 'immutable';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { CourseSearchItem } from './course-search-item';
import { Button } from './button';
import { Fa } from './fa';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

const INPUT_DEBOUNCE_TIME = 500;

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
  currentCourses: Model.Course[];
  onChangeCourses: (courses: Model.Course[]) => void;
  onCancel: () => void;
}

export class CourseSearch extends Model.store.connect({
  scope: store => store.catalog,
  descope: store => store,
  initialState: {
    searchResults: {
      count: 0,
      results: Immutable.Seq.Indexed(),
    } as Model.SearchResults,
    currentCourses: [] as Model.Course[],
  },
  propsExample: (undefined as any) as CourseSearchProps,
}) {
  input$ = new Subject<string>();
  subscription: Subscription | undefined;
  htmlForId = uuid();

  componentDidMount() {
    this.subscription = this.input$.pipe(debounceTime(INPUT_DEBOUNCE_TIME)).subscribe(input => {
      const searchResults = this.store.search(input);
      this.setState(previousState => ({
        ...previousState,
        searchResults,
      }));
    });
  }
  componentWillReceiveProps(nextProps: CourseSearchProps) {
    this.setState(previousState => ({
      ...previousState,
      currentCourses: nextProps.currentCourses,
    }));
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
    const top = this.state.searchResults.results.take(takeAway);
    const totalCount = this.state.searchResults.count;
    const count = this.state.searchResults.count - top.count();
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
              {this.props.currentCourses.map(course => (
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
