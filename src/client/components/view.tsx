import * as React from 'react';
import styled from 'styled-components';

export interface ViewProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

export const View = styled.div`
  display: flex;
  flex-direction: column;
  flex: 0 0 auto;
`;
