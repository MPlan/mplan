import * as React from 'react';
import * as Model from '../models';
import * as Immutable from 'immutable';
import * as styles from '../styles';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { CourseSearchItem } from './course-search-item';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';
import * as uuid from 'uuid/v4';

const INPUT_DEBOUNCE_TIME = 500;

const Container = styled(View)`
  width: 50rem;
  flex-direction: row;
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

export interface CourseSearchProps {}

export class CourseSearch extends Model.store.connect({
  scope: store => store.catalog,
  descope: store => store,
  initialState: {
    searchResults: {
      count: 0,
      results: Immutable.Seq.Indexed(),
    } as Model.SearchResults,
  },
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
  // handleSearchRef = (e: HTMLInputElement | null | undefined) => {
  //   if (!e) return;
  //   e.focus();
  //   e.select();
  // };

  render() {
    const takeAway = 20;
    const top = this.state.searchResults.results.take(takeAway);
    const totalCount = this.state.searchResults.count;
    const count = this.state.searchResults.count - top.count();
    return (
      <Container>
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
            {top.map(course => <CourseSearchItem key={course.id} course={course} />)}
          </SearchResults>
          <Count>
            {count > 0
              ? `Showing first ${takeAway} results of ${totalCount}. Refine your search to see more.`
              : `${totalCount} results.`}
          </Count>
        </SearchHalf>

        <CurrentList>
          <CurrentListLabel>Current courses:</CurrentListLabel>
        </CurrentList>
      </Container>
    );
  }
}
