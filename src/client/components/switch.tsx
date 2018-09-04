import * as React from 'react';
import styled from 'styled-components';

const Slider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
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
    transition: 0.4s;
  }
`;
const SwitchInput = styled.input`
  display: none;
`;
const Root = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;

  ${SwitchInput}:checked + ${Slider} {
    background-color: #2196f3;
  }

  ${SwitchInput}:focus + ${Slider} {
    box-shadow: 0 0 1px #2196f3;
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
    const { innerRef, ref, ...restOfProps } = this.props;
    return (
      <Root>
        <SwitchInput {...restOfProps} innerRef={innerRef} type="checkbox" />
        <Slider />
      </Root>
    );
  }
}
