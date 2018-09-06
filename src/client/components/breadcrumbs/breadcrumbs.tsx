import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Text } from 'components/text';
import { Fa } from 'components/fa';

const Root = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
`;
const Crumb = styled(View)`
  margin-right: ${styles.space(0)};
  flex-direction: row;
  align-items: center;
`;
const CrumbText = styled(Text)`
  margin-right: ${styles.space(-1)};
  text-transform: uppercase;
  font-size: ${styles.space(-1)};
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;

interface BreadcrumbsProps {
  path: string[];
  onPathClick: (index: number) => void;
}

export class Breadcrumbs extends React.PureComponent<BreadcrumbsProps, {}> {
  render() {
    const { path, onPathClick } = this.props;
    return (
      <Root>
        {path.map((crumb, index) => (
          <Crumb key={index} onClick={() => onPathClick(index)}>
            <CrumbText>{crumb}</CrumbText>
            {index < path.length - 1 && <Fa icon="angleRight" />}
          </Crumb>
        ))}
      </Root>
    );
  }
}
