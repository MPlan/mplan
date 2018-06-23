import * as React from 'react';
import styled from 'styled-components';
import { View } from 'components/view';
import { Text } from 'components/text';
import { Page } from 'components/page';

const Container = styled(View)``;

interface SettingsProps {}
interface SettingsState {}

export class Settings extends React.PureComponent<SettingsProps, SettingsState> {
  renderTitleLeft = () => {
    return (
      <View>
        <Text>Title Left!</Text>
      </View>
    );
  };
  render() {
    return (
      <Page title="Settings" subtitle="Change settings here" renderTitleLeft={this.renderTitleLeft}>
        <View>
          <Text extraLarge>Something</Text>
        </View>
      </Page>
    );
  }
}
