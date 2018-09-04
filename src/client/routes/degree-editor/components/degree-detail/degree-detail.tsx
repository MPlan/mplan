import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Card } from 'components/card';
import { Input } from 'components/input';
import { Button } from 'components/button';
import { Fa } from 'components/fa';
import { Divider } from 'components/divider';

const Root = styled(View)`
  flex: 1 1 auto;
  flex-direction: row;
`;
const Sidebar = styled(Card)`
  width: 15rem;
`;
const Content = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
`;
const DegreeGroupList = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
`;
const BackToDegreeButton = styled(Button)`
  margin: 0 ${styles.space(0)};
  margin-bottom: ${styles.space(0)};
`;
const Search = styled(Input)`
  margin: 0 ${styles.space(0)};
  margin-bottom: ${styles.space(0)};
`;
const ArrowLeft = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;

interface DegreeDetailProps {
  masteredDegree: Model.MasteredDegree.Model;
  onBackClick: () => void;
}

export class DegreeDetail extends React.PureComponent<DegreeDetailProps, {}> {
  render() {
    const { onBackClick } = this.props;
    return (
      <Root>
        <Sidebar>
          <BackToDegreeButton onClick={onBackClick}>
            <ArrowLeft icon="angleLeft" />
            Back to degrees
          </BackToDegreeButton>
          <Search type="search" placeholder="Search for groups..." />
          <Divider />
          <DegreeGroupList>{}</DegreeGroupList>
        </Sidebar>
        <Content>{}</Content>
      </Root>
    );
  }
}
