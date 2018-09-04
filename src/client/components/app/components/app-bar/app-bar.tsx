import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';

const Root = styled(View)`
  flex: 0 0 auto;
  padding: ${styles.space(0)};
  flex-direction: row;
  background-color: ${styles.white};
  /* border-bottom: ${styles.border}; */
  box-shadow: ${styles.boxShadow(-2)};
  z-index: 10;
`;
const HeaderContent = styled(View)`
  flex-direction: row;
  justify-content: flex-end;
  flex: 1 1 auto;
`;
const User = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-left: ${styles.space(0)};
`;
const UserName = styled(Text)`
  margin-left: ${styles.space(0)};
`;
const Brand = styled(Text)`
  color: ${styles.deepCove};
`;
const Saving = styled(View)`
  flex-direction: row;
  align-items: center;
  margin-right: ${styles.space(0)};
`;
const SavingText = styled(Text)`
  margin-right: ${styles.space(0)};
`;

interface AppBarProps {
  username: string;
  saving: boolean;
}

export class AppBar extends React.PureComponent<AppBarProps, {}> {
  render() {
    const { saving, username } = this.props;
    return (
      <Root>
        <View>
          <Brand large strong>
            MPlan <Text color={styles.deepCove}>(beta)</Text>
          </Brand>
        </View>

        <HeaderContent>
          <Saving>
            <SavingText>{saving ? 'Saving...' : 'All changes saved'}</SavingText>
            {!!saving && <Fa icon="spinner" pulse size="2x" />}
          </Saving>
          <User>
            <Fa icon="user" size="2x" />
            <UserName>{username}</UserName>
          </User>
        </HeaderContent>
      </Root>
    );
  }
}
