import * as React from 'react';
import * as Model from '../models';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';
import { DropdownMenu } from './dropdown-menu';

const Container = styled(View)``;

const Title = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
  margin-right: ${styles.space(1)};
`;
const TitleRow = styled(View)`
  flex-direction: row;
  align-items: flex-end;
`;
const Separator = styled.div`
  width: 0.1rem;
  align-self: stretch;
  background-color: ${styles.grayLight};
  margin-right: ${styles.space(0)};
`;
const Header = styled(View)`
  margin: ${styles.space(1)};
`;
const Card = styled(View)`
  background-color: ${styles.white};
  padding: ${styles.space(0)};
  box-shadow: ${styles.boxShadow(1)};
`;
const Body = styled(View)`
  flex: 1;
`;

const titleDropdownActions = {
  rename: {
    text: 'Rename',
    icon: 'pencil',
  },
  delete: {
    text: 'Delete',
    icon: 'trash',
    color: styles.red,
  },
};

const initialState = {};
type InitialState = typeof initialState;
interface MasteredDegreeDetailState extends InitialState {}

export interface MasteredDegreeDetailProps {
  masteredDegree: Model.MasteredDegree;
}

export class MasteredDegreeDetail extends React.Component<
  MasteredDegreeDetailProps,
  MasteredDegreeDetailState
> {
  handleTitleActions = (action: keyof typeof titleDropdownActions) => {};

  render() {
    const { masteredDegree } = this.props;
    return (
      <Container>
        <Header>
          <TitleRow>
            <Title>{masteredDegree.name}</Title>
            <Separator />
            <DropdownMenu
              header={masteredDegree.name}
              actions={titleDropdownActions}
              onAction={this.handleTitleActions}
            />
          </TitleRow>
        </Header>
        <Body>
          <Text>Description</Text>
          <Card>
            <Text>
              The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy
              dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over the
              lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps over
              the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox jumps
              over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown fox
              jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick brown
              fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The quick
              brown fox jumps over the lazy dog. The quick brown fox jumps over the lazy dog. The
              quick brown fox jumps over the lazy dog.
            </Text>
          </Card>
        </Body>
      </Container>
    );
  }
}
