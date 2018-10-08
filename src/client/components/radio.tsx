import * as React from 'react';
import * as styles from 'styles';
import * as uuid from 'uuid/v4';
import styled from 'styled-components';

import { View } from 'components/view';

const Root = styled(View)`
  padding: ${styles.space(-1)};
  &:hover,
  &:focus {
    background-color: ${styles.whiteTer};
  }
  &:active {
    background-color: ${styles.grayLighter};
  }
`;
const RadioButton = styled.input`
  margin-right: ${styles.space(0)};

  &:checked + label {
    color: ${styles.blue};
  }
`;
const Label = styled.label`
  font-family: ${styles.fontFamily};
  font-weight: bold;
`;
const Row = styled(View)`
  flex-direction: row;
`;

interface RadioProps {
  className?: string;
  label: string;
  value: string;
  name: string;
  checked: boolean;
  description?: React.ReactNode;
  onChange: () => void;
}

export class Radio extends React.PureComponent<RadioProps, {}> {
  radioId = `radio-${uuid()}`;

  render() {
    const { className, name, label, value, checked, onChange, description } = this.props;

    return (
      <Root className={className} onClick={onChange}>
        <Row>
          <RadioButton
            type="radio"
            id={this.radioId}
            name={name}
            value={value}
            checked={checked}
            onChange={onChange}
          />
          <Label htmlFor={this.radioId}>{label}</Label>
        </Row>
        {description}
      </Root>
    );
  }
}
