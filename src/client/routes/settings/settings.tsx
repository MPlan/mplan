import * as React from 'react';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';
import { Fa } from 'components/fa';
import { Text } from 'components/text';
import { Page } from 'components/page';
import { Button } from 'components/button';
import { Block } from './block';
import { Auth } from '../../auth';

const Row = styled(View)`
  flex-direction: row;
`;
const SignOut = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;

interface SettingsProps {}
interface SettingsState {}

export class Settings extends React.PureComponent<SettingsProps, SettingsState> {
  renderSubtitle = () => {
    return <Text>Change your settings here.</Text>;
  };

  handleLogout = () => {
    Auth.logout();
  };

  render() {
    return (
      <Page title="Settings" renderSubtitle={this.renderSubtitle} addPadding>
        <Block title="User info">
          <Row>
            <Text strong>Username:{' '}</Text>
            <Text>{Auth.userDisplayName()}</Text>
          </Row>
        </Block>
        <Block title="Logout of MPlan">
          <Row>
            <Button onClick={this.handleLogout}>
              <SignOut icon="signOut" />Click here to Logout
            </Button>
          </Row>
        </Block>
      </Page>
    );
  }
}
