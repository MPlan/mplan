import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';
import { range } from 'lodash';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Card } from 'components/card';
import { Input } from 'components/input';
import { Button } from 'components/button';
import { Fa } from 'components/fa';
import { Divider } from 'components/divider';

const Root = styled(View)`
  flex: 1 1 auto;
  flex-direction: row;
  overflow: hidden;
`;
const Sidebar = styled(Card)`
  width: 15rem;
`;
const Body = styled(View)`
  flex: 1 1 auto;
  overflow: auto;
  padding: 0 ${styles.space(1)};
`;
const Content = styled(View)`
  flex: 1 1 auto;
  width: 50rem;
  max-width: 100%;
  margin: ${styles.space(1)} auto;
  border: 1px solid ${styles.borderColor};
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
const Title = styled(Text)``;

interface DegreeDetailProps {
  masteredDegree: Model.MasteredDegree.Model;
  onBackClick: () => void;
}

export class DegreeDetail extends React.PureComponent<DegreeDetailProps, {}> {
  render() {
    const { onBackClick, masteredDegree } = this.props;
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
        <Body>
          <Content>
            <Title>{masteredDegree.name}</Title>
            {range(100).map(i => (
              <Text key={i}>test</Text>
            ))}
            <Text>last</Text>
          </Content>
        </Body>
      </Root>
    );
  }
}
