import * as React from 'react';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';
import { Fa } from './fa';

interface ContainerProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  open?: boolean;
}
const Container = styled<ContainerProps>(View)`
  ${props => (props.open ? 'flex: 1;' : '')};
`;
const Header = styled(View)`
  padding: ${styles.space(-1)};
  z-index: 3;
  flex-direction: row;
`;
const HeaderText = styled(Text)`
  font-size: ${styles.space(0)};
`;
const Icon = styled.div`
  margin-right: ${styles.space(-1)};
  min-width: 1rem;
`;
const Body = styled<ContainerProps>(View)`
  max-height: ${props => (props.open ? '100rem' : '0')};
  overflow: ${props => (props.open ? 'auto' : 'hidden')};
  transition: all 200ms;
`;

interface AccordionProps {
  header: string;
  open: boolean;
  onToggle: () => void;
  children: any;
}

export function Accordion(props: AccordionProps) {
  return (
    <Container open={props.open}>
      <Header
        onClick={props.onToggle}
        style={{ boxShadow: props.open ? '0 0.4rem 0.5rem 0 rgba(12, 0, 51, 0.05)' : '' }}
      >
        <Icon>{props.open ? <Fa icon="angleDown" /> : <Fa icon="angleRight" />}</Icon>
        <HeaderText>{props.header}</HeaderText>
      </Header>
      <Body open={props.open}>{props.children}</Body>
    </Container>
  );
}
