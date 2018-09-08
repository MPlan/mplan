import styled from 'styled-components';

import { View, ViewProps } from 'components/view';

interface SlideProps extends ViewProps {
  currentSlide?: number;
  slide?: number;
}

export const Slide = styled<SlideProps>(View)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: ${props => `${-((props.currentSlide || 0) - (props.slide || 0)) * 100}%`};
  transition: all 500ms;
`;
