import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { searchList } from 'utilities/search-list';

import { View } from 'components/view';
import { Card } from 'components/card';
import { Input } from 'components/input';
import { Empty } from 'components/empty';

import { DegreeListItem } from './degree-list-item';

const Root = styled(Card)`
  flex: 1 1 auto;
  margin: 0 auto;
  margin-bottom: ${styles.space(0)};
  overflow: hidden;
  width: 50rem;
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
  onMasteredDegreeClick: (masteredDegreeId: string) => void;
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

  handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const search = e.currentTarget.value;
    this.setState({ search });
  };

  render() {
    const { search } = this.state;
    const masteredDegrees = this.filteredMasteredDegrees();
    const shouldShowNoResults = masteredDegrees.length <= 0 && !search;

    return (
      <Root>
        <Search placeholder="Search for a degree..." onChange={this.handleSearch} />
        <List>
          {masteredDegrees.length <= 0 ? (
            !search ? (
              <Empty
                title="Nothing here yet!"
                subtitle="Create a new degree to get start."
                size="large"
              />
            ) : (
              <Empty
                title="Oh no!"
                subtitle={`We couldn't find anything for "${search}"`}
                size="large"
              />
            )
          ) : (
            masteredDegrees.map(masteredDegree => (
              <DegreeListItem
                key={masteredDegree.id}
                masteredDegree={masteredDegree}
                onClick={() => this.props.onMasteredDegreeClick(masteredDegree.id)}
              />
            ))
          )}
        </List>
      </Root>
    );
  }
}
