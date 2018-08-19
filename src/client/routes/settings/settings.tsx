import * as React from 'react';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';
import { Fa } from 'components/fa';
import { Text } from 'components/text';
import { Page } from 'components/page';
import { Button } from 'components/button';
import { createAreYouSure } from 'components/are-you-sure';
import { Block } from './block';
import { KeyValue } from './key-value';
import { Auth } from '../../auth';
import * as moment from 'moment';
import { oneLine } from 'common-tags';
import * as download from 'downloadjs';

const AreYouSure = createAreYouSure();

const Row = styled(View)`
  flex-direction: row;
`;
const SignOut = styled(Fa)`
  margin-right: ${styles.space(-1)};
`;
const Description = styled(Text)`
  margin-bottom: ${styles.space(-1)};
`;
const Disclaimer = styled(Text)`
  margin-bottom: ${styles.space(-1)};
  font-weight: bold;
`;
const Divider = styled(View)`
  border-bottom: solid 1px ${styles.grayLighter};
  margin: ${styles.space(-1)} 0;
`;

interface SettingsProps {
  registerDate: number;
  lastLoginDate: number;
  lastUpdateDate: number;
  degreeName: string;
  onResetDegree: () => void;
}

export class Settings extends React.PureComponent<SettingsProps, {}> {
  renderSubtitle = () => {
    return <Text light>Change your settings here.</Text>;
  };

  handleLogout = () => {
    Auth.logout();
  };

  handleDownloadUser = async () => {
    const token = await Auth.token();
    const response = await fetch(`/api/users/${Auth.username()}`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
    const blob = await response.blob();
    download(blob, `${Auth.username()}.json`);
  };

  handleDownloadCatalog = async () => {
    const token = await Auth.token();
    const response = await fetch(`/api/catalog`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
    const blob = await response.blob();
    download(blob, 'catalog.json');
  };

  handleDownloadDegrees = async () => {
    const token = await Auth.token();
    const response = await fetch(`/api/degrees`, {
      headers: new Headers({
        Authorization: `Bearer ${token}`,
      }),
    });
    const blob = await response.blob();
    download(blob, 'degrees.json');
  };

  render() {
    return (
      <Page title="Settings" renderSubtitle={this.renderSubtitle} addPadding>
        <Block title="User Info">
          <KeyValue title="Username" value={Auth.userDisplayName()} />
          <KeyValue title="Register Date" value={moment(this.props.registerDate).calendar()} />
          <KeyValue title="Last Update Date" value={moment(this.props.lastUpdateDate).calendar()} />
        </Block>
        <Block title="Logout of MPlan">
          <Row>
            <Button onClick={this.handleLogout}>
              <SignOut icon="signOut" />
              Click here to Logout
            </Button>
          </Row>
        </Block>
        <Block title="Degree Settings">
          <KeyValue title="Current Degree Program" value={this.props.degreeName} />
          <Divider />
          <Description>If you wish to change your degree, you may reset it. </Description>
          <Disclaimer>
            Resetting your degree will remove all courses from the degree worksheet. This action
            cannot be undone.
          </Disclaimer>
          <Row>
            <AreYouSure.Button>Reset Degree</AreYouSure.Button>
          </Row>
        </Block>
        <Block title="Download Data">
          <Description>
            You can download all your user data to a single <code>.json</code> file. This file will
            include all the data we have on you.
          </Description>
          <Row>
            <Button onClick={this.handleDownloadUser}>Download User Data</Button>
          </Row>
          <Divider />
          <Description>
            You can also download a copy of catalog this system uses. This catalog contains all the
            course data we have available in the system besides historical course offerings.
          </Description>
          <Row>
            <Button onClick={this.handleDownloadCatalog}>Download Catalog</Button>
          </Row>
          <Divider />
          <Description>
            You may also need a copy of the mastered degree programs created in this system by your
            system administrators / university advisors. You can join this data with your user data
            to get the names and validation for mastered degree.
          </Description>
          <Row>
            <Button onClick={this.handleDownloadDegrees}>Download Mastered Degrees</Button>
          </Row>
        </Block>
        <AreYouSure.Modal
          title="Are you sure you want to reset your degree?"
          description={oneLine`
            Resetting your degree will remove all courses from the degree worksheet and sequence
            page. This action cannot be undone.
          `}
          confirmText="Yes, reset it"
          cancelText="No, don't reset it"
          onConfirm={this.props.onResetDegree}
        />
      </Page>
    );
  }
}
