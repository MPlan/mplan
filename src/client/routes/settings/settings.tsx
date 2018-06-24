import * as React from 'react';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';
import { Fa } from 'components/fa';
import { Text } from 'components/text';
import { Page } from 'components/page';
import { Button } from 'components/button';
import { Block } from './block';
import { KeyValue } from './key-value';
import { Auth } from '../../auth';
import * as moment from 'moment';

const Row = styled(View)`
  flex-direction: row;
`;
const SignOut = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;
const ResetDegree = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const Disclaimer = styled(Text)`
  margin-bottom: ${styles.space(-1)};
  font-weight: bold;
`;
const Divider = styled(View)`
  border-bottom: solid 1px ${styles.grayLighter};
  margin-bottom: ${styles.space(-1)};
`;

interface SettingsProps {
  registerDate: number;
  lastLoginDate: number;
  lastUpdateDate: number;
  degreeName: string;
}

export class Settings extends React.PureComponent<SettingsProps, {}> {
  renderSubtitle = () => {
    return <Text light>Change your settings here.</Text>;
  };

  handleLogout = () => {
    Auth.logout();
  };

  render() {
    return (
      <Page title="Settings" renderSubtitle={this.renderSubtitle} addPadding>
        <Block title="User Info">
          <KeyValue title="Username" value={Auth.userDisplayName()} />
          <KeyValue title="Register Date" value={moment(this.props.registerDate).calendar()} />
          <KeyValue title="Last Login Date" value={moment(this.props.lastLoginDate).calendar()} />
          <KeyValue title="Last Update Date" value={moment(this.props.lastUpdateDate).calendar()} />
        </Block>
        <Block title="Logout of MPlan">
          <Row>
            <Button onClick={this.handleLogout}>
              <SignOut icon="signOut" />Click here to Logout
            </Button>
          </Row>
        </Block>
        <Block title="Degree Settings">
          <KeyValue title="Current Degree Program" value={this.props.degreeName} />
          <Divider />
          <ResetDegree>If you wish to change your degree, you may reset it. </ResetDegree>
          <Disclaimer>
            Resetting your degree will remove all courses from the degree worksheet. This action
            cannot be undone.
          </Disclaimer>
          <Row>
            <Button>Reset Degree</Button>
          </Row>
        </Block>
      </Page>
    );
  }
}
