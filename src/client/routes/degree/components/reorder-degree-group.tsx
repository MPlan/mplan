import * as React from 'react';
import * as Model from 'models';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';

const Container = styled(View)`
  flex-direction: row;
  padding: ${styles.space(0)} ${styles.space(1)};
`;
const Name = styled(Text)``;

interface ReorderCourseProps {
  degreeGroup: Model.DegreeGroup;
}

export function ReorderDegreeGroup({ degreeGroup }: ReorderCourseProps) {
  return (
    <Container>
      <Name>{degreeGroup.name}</Name>
    </Container>
  );
}
