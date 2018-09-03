import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Card } from 'components/card';
import { Fa } from 'components/fa';

import { DegreeListItem } from './degree-list-item';

const Root = styled(Card)`
  flex: 1 1 auto;
  margin: 0 ${styles.space(1)};
  margin-bottom: ${styles.space(0)};
`;
const SearchRow = styled(View)`
  flex-direction: row;
`;
const Search = styled.input`
  font-family: ${styles.fontFamily};
  flex: 1 1 auto;
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

  handleDegreeClick = (masteredDegreeId: string) => {};

  render() {
    const { masteredDegrees } = this.props;
    return (
      <Root>
        <SearchRow>
          <Search />
          <Fa icon="search" />
        </SearchRow>
        <List>
          {masteredDegrees.map(masteredDegree => (
            <DegreeListItem
              key={masteredDegree.id}
              masteredDegree={masteredDegree}
              onClick={() => this.handleDegreeClick(masteredDegree.id)}
            />
          ))}
        </List>
      </Root>
    );
  }
}
