import * as React from 'react';
import * as Model from '../models';
import * as styles from '../styles';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import { View } from './view';
import { Text } from './text';
import { Fa } from './fa';

const Container = styled(View)`
  flex-direction: row;
  padding: ${styles.space(0)};
  &:hover {
    box-shadow: 0 0.1rem 1rem 0 rgba(12, 0, 51, 0.15);
    z-index: 15;
  }
  transition: all 0.2s;
  &:active {
    box-shadow: 0 0.2rem 1.3rem 0 rgba(12, 0, 51, 0.2);
  }
`;
const Icon = styled(View)`
  min-width: ${styles.space(1)};
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-left: ${styles.space(-1)};
`;
const StyledLink = styled(NavLink)`
  &,
  & * {
    color: ${styles.text};
    text-decoration: none;
  }
  &.active {
    background-color: ${styles.whiteTer};
  }
  &:hover {
    text-decoration: underline;
  }
`;
export interface DegreeItemSidebarProps {
  masteredDegree: Model.MasteredDegree;
}

export function DegreeItemSidebar(props: DegreeItemSidebarProps) {
  const { masteredDegree } = props;
  return (
    <StyledLink to={`/degree-editor/${masteredDegree.id}`} activeClassName="active">
      <Container>
        <Text strong>{masteredDegree.name}</Text>
        <Icon>
          <Fa icon="chevronRight" />
        </Icon>
      </Container>
    </StyledLink>
  );
}
