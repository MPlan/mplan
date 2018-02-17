import * as React from 'react';
import { View, Text, Button, Fa } from '../components';
import { Auth } from '../auth';
import styled from 'styled-components';
import * as styles from '../styles';

function onButtonClick() {
  Auth.login();
}

const LandingContainer = styled(View) `
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const LandingContent = styled(View) `
  margin: ${styles.space(0)};
  max-width: 50rem;
`;

const Header = styled(View) `
  flex-direction: row;
  align-items: baseline;
  margin-bottom: ${styles.space(0)};
`;

const ElevatorPitch = styled(View) `
  margin-bottom: ${styles.space(0)};
`;

const Description = styled(View) `
  margin-bottom: ${styles.space(0)};
`;

export function Landing() {
  return <LandingContainer>
    <LandingContent>
      <Header>
        <Text strong extraLarge>Save your&nbsp;</Text>
        <Text extraLarge>(academic)&nbsp;</Text>
        <Text strong extraLarge>life with MPlan.</Text>
      </Header>
      <ElevatorPitch>
        <Text large>
          MPlan is your personalized degree completion planning tool made with &nbsp;
          <Fa icon="heart" />&nbsp;for students by students. Never delay your graduation again.
        </Text>
      </ElevatorPitch>
      <Description>
        <Text>
          MPlan is currently under construction. Anything presented here is a very early
          pre-production, pre-alpha preview and may not represent the current state of the
          application. There are no privacy guarantees at this time (though there will be in the
          future). Email Rico Kahler <a href="mailto:rakahler@umich.edu">rakahler@umich.edu</a> if
          you have any questions.
        </Text>
      </Description>
    </LandingContent>
    <Button onClick={onButtonClick}><Text>Click here to log in or sign up!</Text></Button>
  </LandingContainer>
}
