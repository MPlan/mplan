import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';
import { isEqual } from 'lodash';

import { View, ViewProps } from 'components/view';
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

interface BreadcrumbsProps extends ViewProps {
  path: string[];
  onPathClick: (index: number) => void;
}

export class Breadcrumbs extends React.Component<BreadcrumbsProps, {}> {
  shouldComponentUpdate(nextProps: BreadcrumbsProps) {
    const currentPath = this.props.path;
    const nextPath = nextProps.path;

    if (isEqual(currentPath, nextPath)) return false;
    return true;
  }

  render() {
    const { path, onPathClick, ref, ...restOfProps } = this.props;
    return (
      <Root {...restOfProps}>
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
