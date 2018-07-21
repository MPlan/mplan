import * as React from 'react';
import styled from 'styled-components';
import * as styles from 'styles';
import { View, ViewProps } from 'components/view';
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
  margin-right: auto;
  max-width: 50rem;
`;
const TitleLeftContainer = styled(View)`
  margin-left: ${styles.space(1)};
`;
const Title = styled(Text)`
  font-size: ${styles.space(2)};
  font-weight: ${styles.bold};
  color: ${styles.textLight};
`;
interface BodyProps extends ViewProps {
  addPadding?: boolean;
}
const Body = styled<BodyProps>(View)`
  flex: 1 1 auto;
  ${props => (props.addPadding ? `padding: 0 ${styles.space(1)};` : '')};
`;

interface PageProps {
  title: string;
  // TODO: these should just be nodes
  renderSubtitle?: React.ComponentType<any>;
  renderTitleLeft?: React.ComponentType<any>;
  children?: any;
  addPadding?: boolean;
}

export class Page extends React.PureComponent<PageProps, any> {
  render() {
    const TitleLeft = this.props.renderTitleLeft;
    const Subtitle = this.props.renderSubtitle;
    return (
      <Container>
        <TitleRow>
          <TitleContainer>
            <Title>{this.props.title}</Title>
            {Subtitle && <Subtitle />}
          </TitleContainer>
          {TitleLeft && (
            <TitleLeftContainer>
              <TitleLeft />
            </TitleLeftContainer>
          )}
        </TitleRow>
        <Body addPadding={this.props.addPadding}>{this.props.children}</Body>
      </Container>
    );
  }
}
