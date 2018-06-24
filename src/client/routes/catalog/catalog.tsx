import * as React from 'react';
import * as Model from 'models';
import styled from 'styled-components';
import { View } from 'components/view';
import { Text } from 'components/text';
import { ActionableText } from 'components/actionable-text';
import { Course } from './course';
import * as styles from 'styles';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime } from 'rxjs/operators';

const INPUT_DEBOUNCE_TIME = 250;

const Container = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
  flex-direction: row;
`;
const Aside = styled(View)`
  flex: 0 0 auto;
  background-color: ${styles.white};
  box-shadow: ${styles.boxShadow(0)};
  min-width: 15rem;
  padding: ${styles.space(0)};
`;
const Body = styled(View)`
  flex: 1 1 auto;
  padding: ${styles.space(1)};
  max-width: 60rem;
  margin: 0 auto;
`;
const SearchRow = styled(View)`
  flex-direction: row;
  align-items: flex-end;
  flex: 0 0 auto;
`;
const BigSearch = styled.input`
  flex: 1 1 auto;
  padding: ${styles.space(0)};
  font-size: ${styles.space(2)};
  font-family: ${styles.fontFamily};
  font-weight: ${styles.bold};
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
`;
const Scrollable = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
`;
const Header = styled(Text)`
  font-size: ${styles.space(1)};
  font-weight: ${styles.bold};
  margin-bottom: ${styles.space(-1)};
  color: ${styles.textLight};
`;

export interface CatalogProps {
  onSearch: (query: string) => void;
  searchResults: Model.Course[];
  totalMatches: number;
}

interface CatalogState {
  searchValue: string;
}

export class Catalog extends React.PureComponent<CatalogProps, CatalogState> {
  search$ = new Subject<string>();
  searchSubscription: Subscription | undefined;

  constructor(props: CatalogProps) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  componentDidMount() {
    this.searchSubscription = this.search$
      .pipe(debounceTime(INPUT_DEBOUNCE_TIME))
      .subscribe(this.props.onSearch);
  }

  componentWillUnmount() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
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

  render() {
    return (
      <Container>
        <Body>
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
            <Text light>{this.props.totalMatches} results</Text>
          </InfoRow>
          <Scrollable>
            {this.props.searchResults.map(course => <Course key={course.id} course={course} />)}
            <Text light>
              Showing {this.props.searchResults.length} of {this.props.totalMatches} results.{' '}
              {this.props.searchResults.length !== this.props.totalMatches
                ? 'Refine your search to see more.'
                : ''}
            </Text>
          </Scrollable>
        </Body>
      </Container>
    );
  }
}
