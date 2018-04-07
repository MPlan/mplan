import * as React from 'react';
import styled from 'styled-components';
import * as styles from '../styles';
import { View } from './view';
import { Text } from './text';

const Container = styled(View)`
  flex-direction: row;
  align-items: center;
`;
const Name = styled(Text)`
  margin-right: auto;
`;
const Count = styled(Text)``;
const CheckboxContainer = styled.label`
  display: flex;
  min-width: 5rem;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding: ${styles.space(-1)} 0;
`;
const Checkbox = styled.input`
  margin-right: ${styles.space(0)};
`;

export interface CategoryItemProps {
  category: string;
  count: number;
  checked: boolean;
  onCategoryChange: () => void;
}

export function CategoryItem({ category, count, checked, onCategoryChange }: CategoryItemProps) {
  return (
    <Container>
      <CheckboxContainer>
        <Checkbox type="checkbox" checked={checked} onChange={onCategoryChange} />
      </CheckboxContainer>
      <Name>{category}</Name>
      <Count>{count}</Count>
    </Container>
  );
}
