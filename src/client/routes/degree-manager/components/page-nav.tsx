import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { Breadcrumbs } from 'components/breadcrumbs';
import { VerticalBar } from 'components/vertical-bar';
import { View } from 'components/view';
import { OutlineButton } from 'components/button';
import { Fa as _Fa } from 'components/fa';

const Root = styled(View)`
  flex: 0 0 auto;
  flex-direction: row;
  margin-bottom: ${styles.space(-1)};
`;
const BackButton = styled(OutlineButton)`
  font-size: ${styles.space(-1)};
  margin-right: ${styles.space(-1)};
`;
const Fa = styled(_Fa)`
  margin-right: ${styles.space(-1)};
`;

interface PageNavProps {
  backTitle: string;
  onBackClick: () => void;
}

export class PageNav extends React.Component<PageNavProps, {}> {
  render() {
    const { backTitle, onBackClick } = this.props;
    return (
      <Root>
        <BackButton onClick={onBackClick}>
          <Fa icon="angleLeft" />
          {backTitle}
        </BackButton>
        <VerticalBar />
        <Breadcrumbs />
      </Root>
    );
  }
}
