import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  height: 30rem;
  background-color: red;
  padding: 1rem;
`;

const ChildA = styled.div`
  background-color: blue;
  min-height: 5rem;
  flex: 0 0 33%;
`;

const ChildB = styled.div`
  background-color: green;
  flex: 0 0 33%;
  min-height: 5rem;
`;

const ChildC = styled.div`
  background-color: yellow;
  flex: 0 0 33%;
  min-height: 5rem;
`;

export function App() {
  return <Container>
    <ChildA />
    <ChildB />
    <ChildC />
  </Container>;
}