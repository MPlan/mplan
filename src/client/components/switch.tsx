// https://www.w3schools.com/howto/howto_css_switch.asp
import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${styles.grayLighter};
  transition: all 400ms;
  border-radius: 99999px;

  &:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: all 400ms;
  }
`;
const SwitchInput = styled.input`
  display: none;
`;
const Root = styled.label`
  flex: 0 0 auto;
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  ${SwitchInput}:checked + ${Slider} {
    background-color: ${styles.blue};
  }

  ${SwitchInput}:focus + ${Slider} {
    box-shadow: 0 0 1px ${styles.blue};
  }

  ${SwitchInput}:checked + ${Slider}:before {
    transform: translateX(26px);
  }
`;

interface SwitchProps extends React.HTMLProps<HTMLInputElement> {
  innerRef?: any;
}

export class Switch extends React.Component<SwitchProps, {}> {
  render() {
    const { innerRef, ref, className, ...restOfProps } = this.props;
    return (
      <Root className={className}>
        <SwitchInput {...restOfProps} innerRef={innerRef} type="checkbox" />
        <Slider />
      </Root>
    );
  }
}
