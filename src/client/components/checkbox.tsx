import * as React from 'react';
import * as styles from '../styles';
import styled from 'styled-components';
import * as uuid from 'uuid/v4';
import { View } from './view';

const Container = styled(View)`
  flex-direction: row;
  margin-bottom: ${styles.space(-1)};
  align-items: center;
`;
const StyledCheckbox = styled.input`
  margin-right: ${styles.space(-1)};
`;
const Label = styled.label`
  font-family: ${styles.fontFamily};
  color: ${styles.text};
  width: 10rem;
`;

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  label: string;
  innerRef?: React.Ref<any>;
}

export class Checkbox extends React.PureComponent<CheckboxProps, {}> {
  labelId = `label-${uuid()}`;
  render() {
    const { label, ref, innerRef, ...restOfProps } = this.props;
    return (
      <Container>
        <StyledCheckbox
          id={this.labelId}
          innerRef={innerRef as any}
          {...restOfProps}
          type="checkbox"
        />
        <Label htmlFor={this.labelId}>{this.props.label}</Label>
      </Container>
    );
  }
}
