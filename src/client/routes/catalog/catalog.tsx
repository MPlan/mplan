import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';
import { View, Text, CatalogCourse } from 'components';
import * as styles from 'styles';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';

const INPUT_DEBOUNCE_TIME = 250;

const Container = styled(View)`
  flex-direction: row;
  flex: 1;
`;
const Sidebar = styled(View)`
  width: 16rem;
  box-shadow: ${styles.boxShadow(0)};
  background-color: ${styles.white};
`;
const SidebarHeader = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  padding: ${styles.space(0)};
  color: ${styles.textLight};
`;
const Content = styled(View)`
  width: 50rem;
  margin: 0 auto;
  & > * {
    flex-shrink: 0;
  }
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
`;
const SearchInput = styled.input`
  font-family: ${styles.fontFamily};
  padding: ${styles.space(0)};
  font-size: ${styles.space(1)};
  border: none;
  outline: none;
  box-shadow: ${styles.boxShadow(0)};
  margin-bottom: ${styles.space(1)};
`;
const SearchLabel = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const CatalogHeader = styled(Text)`
  margin-top: ${styles.space(0)};
  color: ${styles.textLight};
  font-weight: ${styles.bold};
  font-size: ${styles.space(2)};
  margin-bottom: ${styles.space(0)};
`;
const Card = styled(View)`
  flex: 1;
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  box-shadow: ${styles.boxShadow(0)};
  overflow: auto;
  & > * {
    flex-shrink: 0;
  }
`;

export interface CatalogProps {
  searchResults: Model.SearchResults;
  onSearch: (query: string) => void;
}

interface CatalogState {}

export class Catalog extends React.Component<CatalogProps> {
  searchInput$ = new Subject<string>();
  subscription: Subscription | undefined;

  componentDidMount() {
    this.subscription = this.searchInput$
      .pipe(debounceTime(INPUT_DEBOUNCE_TIME))
      .subscribe(this.props.onSearch);
  }

  componentWillUnmount() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    this.searchInput$.next(value);
  };

  render() {
    return (
      <Container>
        <Sidebar>
          <SidebarHeader>Filters</SidebarHeader>
        </Sidebar>
        <Content>
          <CatalogHeader>Catalog</CatalogHeader>
          <Form onSubmit={this.handleSearchSubmit}>
            <SearchLabel>Search for a course or use the filters on the left.</SearchLabel>
            <SearchInput
              type="text"
              placeholder="e.g. MATH 115"
              onChange={this.handleSearchInput}
            />
          </Form>
          <Card>
            {this.props.searchResults.results
              .take(100)
              .map(course => <CatalogCourse key={course.id} course={course} />)}
          </Card>
        </Content>
      </Container>
    );
  }
}
