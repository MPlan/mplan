import * as React from 'react';
import styled from 'styled-components';
import {} from 'react-router';

import { View, ViewProps } from 'components/view';

const SlidesRoot = styled(View)`
  max-width: 100%;
  flex: 1 1 auto;
  overflow: hidden;
  position: relative;
`;

interface SlideRootProps extends ViewProps {
  currentSlide?: number;
  slide?: number;
  active?: boolean;
}
const SlideRoot = styled<SlideRootProps>(View)`
  width: 100%;
  height: 100%;
  position: absolute;
  left: ${props => `${-((props.currentSlide || 0) - (props.slide || 0)) * 100}%`};
  transition: all 500ms;
  z-index: ${props => (props.active ? 1 : 0)};
`;

interface SlideProps extends ViewProps {
  slide: number;
  active: boolean;
}
interface SlidesProps {
  currentSlide?: number;
  defaultSlide?: number;
}
interface SlidesState {
  currentSlide: number;
}

export function createSlides() {
  const { Provider, Consumer } = React.createContext(0);

  let setSlide!: (slide: number) => void;

  class Slides extends React.Component<SlidesProps, SlidesState> {
    // allows the component to be controlled or uncontrolled
    static getDerivedStateFromProps(nextProps: SlidesProps, previousState: SlidesState) {
      const currentSlide =
        (nextProps.currentSlide !== undefined
          ? nextProps.currentSlide
          : previousState.currentSlide) || 0;

      return { ...previousState, currentSlide };
    }

    constructor(props: SlidesProps) {
      super(props);
      this.state = {
        currentSlide: props.defaultSlide || 0,
      };
      setSlide = this.setSlide;
    }

    setSlide = (slide: number) => {
      this.setState({ currentSlide: slide });
    };

    render() {
      const { currentSlide } = this.state;
      return (
        <Provider value={currentSlide}>
          <SlidesRoot {...this.props} />
        </Provider>
      );
    }
  }

  class Slide extends React.Component<SlideProps, {}> {
    render() {
      const { slide, ref, active, children, ...restOfProps } = this.props;
      return (
        <Consumer>
          {currentSlide => (
            <SlideRoot active={active} slide={slide} currentSlide={currentSlide} {...restOfProps}>
              {active && children}
            </SlideRoot>
          )}
        </Consumer>
      );
    }
  }

  return { Slides, Slide, setSlide };
}
