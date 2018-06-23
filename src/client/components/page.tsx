import * as React from 'react';
import styled from 'styled-components';
import * as styles from 'styles';
import { View } from 'components/view';
import { Text } from 'components/text';

const Container = styled(View)`
  flex: 1 1 auto;
`;
const TitleRow = styled(View)`
  flex-direction: row;
  margin: ${styles.space(1)};
  align-items: flex-end;
  flex: 0 0 auto;
`;
const TitleContainer = styled(View)`
  flex: 1 1 auto;
`;
const TitleLeftContainer = styled(View)``;
const Title = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
`;
const Subtitle = styled(Text)`
  color: ${styles.textLight};
`;
const Body = styled(View)`
  flex: 1 1 auto;
`;

interface PageProps {
  title: string;
  subtitle: string;
  renderTitleLeft?: React.ComponentType<any>;
  children?: any;
}

export class Page extends React.PureComponent<PageProps, any> {
  render() {
    const TitleLeft = this.props.renderTitleLeft;
    return (
      <Container>
        <TitleRow>
          <TitleContainer>
            <Title>{this.props.title}</Title>
            <Subtitle>{this.props.subtitle}</Subtitle>
          </TitleContainer>
          {TitleLeft && (
            <TitleLeftContainer>
              <TitleLeft />
            </TitleLeftContainer>
          )}
        </TitleRow>
        <Body>{this.props.children}</Body>
      </Container>
    );
  }
}
