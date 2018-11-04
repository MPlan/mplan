import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';

const Container = styled(View)``;
const Header = styled(Text)`
  text-decoration: underline;
  margin-bottom: ${styles.space(-1)};
`;
const PrerequisiteList = styled.ul`
  margin: 0;
  padding: 0 0 0 ${styles.space(1)};
`;
const PrerequisiteItem = styled.li``;

export interface PreferredPrerequisiteProps {
  bestOption: Set<Model.Course.Model>;
}

export function PreferredPrerequisite(props: PreferredPrerequisiteProps) {
  const { bestOption } = props;
  return (
    <Container>
      <Header small>Preferred prerequisites:</Header>
      <PrerequisiteList>
        {Array.from(bestOption)
          .map(course => Model.Course.getSimpleName(course))
          .map(course => (
            <PrerequisiteItem key={course}>
              <Text small>{course}</Text>
            </PrerequisiteItem>
          ))}
      </PrerequisiteList>
    </Container>
  );
}
