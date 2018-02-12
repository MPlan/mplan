import * as React from 'react';
import { View, Text } from '../components/base';
import { Auth } from '../auth';
import { Button } from '../components/button';
import { Fa } from '../components/fa';

function onButtonClick() {
  Auth.login();
}

export function Landing() {
  return <View flex justifyContent="center" alignItems="center">
    <View margin style={{ maxWidth: '50rem' }}>
      <View row alignItems="baseline" margin={{bottom: true}}>
        <Text strong extraLarge>Save your&nbsp;</Text>
        <Text extraLarge>(academic)&nbsp;</Text>
        <Text strong extraLarge>life with MPlan.</Text>
      </View>
      <View margin={{ bottom: true }}>
        <Text large>
          MPlan is your personalized degree completion planning tool made with &nbsp;
          <Fa icon="heart" />&nbsp;for students by students. Never delay your graduation again.
        </Text>
      </View>
      <View margin={{ bottom: true }}>
        <Text>
          MPlan is currently under construction. Anything presented here is a very early
          pre-production, pre-alpha preview and may not represent the current state of the
          application. There are no privacy guarantees at this time (though there will be in the
          future). Email Rico Kahler <a href="mailto:rakahler@umich.edu">rakahler@umich.edu</a> if
          you have any questions.
        </Text>
      </View>
    </View>
    <Button onClick={onButtonClick}><Text>Click here to log in or sign up!</Text></Button>
  </View >
}
