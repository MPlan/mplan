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

  renderSubtitle = () => {
    return <Text>Change settings here</Text>;
  };

  render() {
    return (
      <Page
        title="Settings"
        renderSubtitle={this.renderSubtitle}
        renderTitleLeft={this.renderTitleLeft}
      >
        <View>
          <Text extraLarge>Something</Text>
        </View>
      </Page>
    );
  }
}
