import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, tap } from 'rxjs/operators';
import { Route, RouteComponentProps } from 'react-router';
import { history } from 'client/history';

import { View } from 'components/view';
import { Text } from 'components/text';
import { ActionableText } from 'components/actionable-text';
import { Loading } from 'components/loading';

import { CourseDetail } from './components/course-detail';
import { Course } from './components/course';

const INPUT_DEBOUNCE_TIME = 250;

const Container = styled(View)`
  flex: 1 1 auto;
  overflow: hidden;
  flex-direction: row;
  position: relative;
  max-width: 100%;
  width: 100%;
`;
const CourseListings = styled(View)`
  overflow: auto;
  width: 60rem;
  max-width: 100%;
  flex: 1 1 auto;
  margin: 0 auto;
`;
const SlideContainer = styled(View)`
  position: absolute;
  transition: all 400ms;
  left: 100%;
  width: 100%;
  height: 100%;
`;
const CourseDetailContainer = styled(View)`
  position: absolute;
  overflow: auto;
  transition: all 400ms;
  left: 100%;
  width: 100%;
  height: 100%;
`;
const SearchRow = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  flex: 0 0 auto;
  margin: 0 ${styles.space(1)};
  margin-top: ${styles.space(1)};
`;
const BigSearch = styled.input`
  flex: 1 1 auto;
  font-size: ${styles.space(2)};
  font-family: ${styles.fontFamily};
  font-weight: ${styles.bold};
  margin-bottom: ${styles.space(-1)};
  color: ${styles.textLight};
  background-color: transparent;
  border: none;
  outline: none;
`;
const ClearSearch = styled(ActionableText)`
  color: ${styles.textLight};
  margin-left: ${styles.space(0)};
`;
const InfoRow = styled(View)`
  border-bottom: solid 1px ${styles.grayLighter};
  flex: 0 0 auto;
  min-height: ${styles.space(0)};
  margin: 0 ${styles.space(1)};
`;
const Scrollable = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
  & > * {
    flex: 0 0 auto;
  }
`;
const CenterMessage = styled(View)`
  flex: 1 1 auto;
  align-items: center;
  justify-content: center;
`;
const Message = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.grayLight};
  max-width: 20rem;
  text-align: center;
`;
const MessageSub = styled(Text)`
  font-size: ${styles.space(1)};
  color: ${styles.grayLight};
  max-width: 22rem;
  text-align: center;
`;

export interface CatalogProps extends RouteComponentProps<any> {
  onSearch: (query: string) => void;
  searchResults: Model.Course.Model[];
  totalMatches: number;
}

interface CatalogState {
  searchValue: string;
  courseSelected: boolean;
}

export class Catalog extends React.PureComponent<CatalogProps, CatalogState> {
  search$ = new Subject<string>();
  searchSubscription: Subscription | undefined;
  searching = false;

  constructor(props: CatalogProps) {
    super(props);
    this.state = {
      searchValue: '',
      courseSelected: false,
    };
  }

  componentDidMount() {
    this.searchSubscription = this.search$
      .pipe(
        tap(() => {
          this.searching = true;
        }),
        debounceTime(INPUT_DEBOUNCE_TIME),
        tap(() => {
          this.searching = false;
        }),
      )
      .subscribe(this.props.onSearch);
  }

  componentWillUnmount() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  get noSearch() {
    return this.props.totalMatches <= 0 && this.state.searchValue === '';
  }

  get noResults() {
    return this.props.totalMatches <= 0 && this.state.searchValue !== '' && !this.searching;
  }

  handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.currentTarget.value;
    this.setState(previousState => ({
      ...previousState,
      searchValue: value,
    }));
    this.search$.next(value);
  };

  handleClearSearch = () => {
    this.props.onSearch('');
    this.setState(previousState => ({
      ...previousState,
      searchValue: '',
    }));
  };

  handleCourseClick(course: Model.Course.Model) {
    history.push(`/catalog/${course.subjectCode}/${course.courseNumber}`);
  }

  get courseSelected() {
    return !this.props.match.isExact;
  }

  renderCourseDetail = (
    route: RouteComponentProps<{ subjectCode: string; courseNumber: string }>,
  ) => {
    const subjectCode = route.match.params.subjectCode;
    const courseNumber = route.match.params.courseNumber;
    if (!subjectCode) return null;
    if (!courseNumber) return null;

    return <CourseDetail subjectCode={subjectCode} courseNumber={courseNumber} />;
  };

  render() {
    return (
      <Container>
        <SlideContainer style={{ left: this.courseSelected ? '-100%' : 0 }}>
          <CourseListings>
            <SearchRow>
              <BigSearch
                type="search"
                placeholder="Search for a course..."
                value={this.state.searchValue}
                onChange={this.handleSearch}
              />
              <ClearSearch onClick={this.handleClearSearch}>Clear Search</ClearSearch>
            </SearchRow>
            <InfoRow>
              {!this.searching && !this.noSearch ? (
                <Text light>{this.props.totalMatches} results</Text>
              ) : null}
            </InfoRow>
            <Scrollable>
              {this.noSearch ? (
                <CenterMessage>
                  <Message>Nothing here yet.</Message>
                  <MessageSub>
                    Search for a course above and your results will display here.
                  </MessageSub>
                </CenterMessage>
              ) : this.noResults ? (
                <CenterMessage>
                  <Message>Oh no!</Message>
                  <MessageSub>We couldn't find anything for "{this.state.searchValue}"</MessageSub>
                </CenterMessage>
              ) : this.searching ? (
                <CenterMessage>
                  <Loading />
                </CenterMessage>
              ) : (
                <>
                  {this.props.searchResults.map(course => (
                    <Course
                      key={course.id}
                      course={course}
                      onClick={() => this.handleCourseClick(course)}
                    />
                  ))}
                  <Text light>
                    Showing {this.props.searchResults.length} of {this.props.totalMatches} results.{' '}
                    {this.props.searchResults.length !== this.props.totalMatches
                      ? 'Refine your search to see more.'
                      : ''}
                  </Text>
                </>
              )}
            </Scrollable>
          </CourseListings>
        </SlideContainer>
        <CourseDetailContainer style={{ left: this.courseSelected ? 0 : '100%' }}>
          <Route path="/catalog/:subjectCode/:courseNumber" render={this.renderCourseDetail} />
        </CourseDetailContainer>
      </Container>
    );
  }
}
