import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { searchList } from 'utilities/search-list';

import { View } from 'components/view';
import { Card } from 'components/card';
import { Input } from 'components/input';
import { NoResults } from 'components/no-results';

import { DegreeListItem } from './degree-list-item';

const Root = styled(Card)`
  flex: 1 1 auto;
  margin: 0 ${styles.space(1)};
  margin-bottom: ${styles.space(0)};
  overflow: hidden;
`;
const Search = styled(Input)`
  margin: 0 ${styles.space(0)};
  margin-bottom: ${styles.space(0)};
`;
const List = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
`;

interface DegreeListProps {
  masteredDegrees: Model.MasteredDegree.Model[];
}
interface DegreeListState {
  search: string;
}

export class DegreeList extends React.PureComponent<DegreeListProps, DegreeListState> {
  constructor(props: DegreeListProps) {
    super(props);

    this.state = {
      search: '',
    };
  }

  filteredMasteredDegrees() {
    return searchList(
      this.props.masteredDegrees,
      masteredDegree => masteredDegree.name,
      this.state.search,
    );
  }

  handleDegreeClick = (masteredDegreeId: string) => {};
  handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    this.setState({ search });
  };

  render() {
    const masteredDegrees = this.filteredMasteredDegrees();
    const shouldShowNoResults = masteredDegrees.length <= 0;

    return (
      <Root>
        <Search placeholder="Search for a degree..." onChange={this.handleSearch} />
        <List>
          {shouldShowNoResults ? (
            <NoResults query={this.state.search} />
          ) : (
            masteredDegrees.map(masteredDegree => (
              <DegreeListItem
                key={masteredDegree.id}
                masteredDegree={masteredDegree}
                onClick={() => this.handleDegreeClick(masteredDegree.id)}
              />
            ))
          )}
        </List>
      </Root>
    );
  }
}
