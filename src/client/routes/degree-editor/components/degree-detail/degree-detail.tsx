import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Card } from 'components/card';
import { Input } from 'components/input';
import { Button } from 'components/button';
import { Fa } from 'components/fa';
import { Divider } from 'components/divider';
import { DropdownMenu } from 'components/dropdown-menu';
import { ActionMenu } from 'components/action-menu';

const Root = styled(View)`
  flex: 1 1 auto;
  flex-direction: row;
  overflow: hidden;
  position: relative;
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
const TitleRow = styled(View)`
  flex-direction: row;
  align-items: flex-end;
`;
const Title = styled(Text)`
  color: ${styles.textLight};
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  margin-right: ${styles.space(0)};
`;
const VerticalBar = styled.div`
  flex: 0 0 auto;
  border-right: 2px solid ${styles.grayLight};
  width: 2px;
  margin-right: ${styles.space(0)};
  align-self: stretch;
`;

interface DegreeDetailProps {
  masteredDegree: Model.MasteredDegree.Model;
  onBackClick: () => void;
}

export class DegreeDetail extends React.PureComponent<DegreeDetailProps, {}> {
  degreeDropdownAction = {
    rename: {
      icon: 'pencil',
      text: 'Rename degree',
    },
  };

  render() {
    const { onBackClick, masteredDegree } = this.props;
    return (
      <Root>
        <ActionMenu actions={this.degreeDropdownAction} onAction={() => {}} />
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
            <TitleRow>
              <Title>{masteredDegree.name}</Title>
              <VerticalBar />
              <DropdownMenu
                header={masteredDegree.name}
                actions={this.degreeDropdownAction}
                onAction={() => {}}
              />
            </TitleRow>
          </Content>
        </Body>
      </Root>
    );
  }
}
