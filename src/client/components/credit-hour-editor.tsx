import * as React from 'react';
import * as styles from 'styles';
import styled from 'styled-components';

import { View } from 'components/view';
import { Button } from 'components/button';

const Root = styled(View)``;
const Label = styled.label`
  font-family: ${styles.fontFamily};
  display: flex;
  justify-content: center;
  align-items: center;
  height: 6rem;
  border: 1px solid ${styles.grayLighter};
`;
const Input = styled.input`
  flex-direction: row;
  font-family: ${styles.fontFamily};
  font-weight: bold;
  font-size: ${styles.space(2)};
  width: 8rem;
  border: none;
  outline: none;
  text-align: center;
`;
const ButtonRow = styled(View)`
  flex-direction: row;
`;
const IncButton = styled(Button)`
  flex: 1 1 auto;
`;

interface CreditHourEditorProps {
  creditHours: number;
  onChange: (creditHours: number) => void;
  capMax?: number;
  capMin?: number;
}

export class CreditHourEditor extends React.PureComponent<CreditHourEditorProps, {}> {
  onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.currentTarget.value, 10);
    this.props.onChange(value);
  };

  onInc = () => {
    const { creditHours, onChange } = this.props;
    onChange(creditHours + 1);
  };
  onDec = () => {
    const { creditHours, onChange } = this.props;
    onChange(creditHours - 1);
  };

  render() {
    const { creditHours } = this.props;
    return (
      <Root>
        <Label>
          <Input value={creditHours} type="number" onChange={this.onChange} />
        </Label>
        <ButtonRow>
          <IncButton onClick={this.onDec}>-</IncButton>
          <IncButton onClick={this.onInc}>+</IncButton>
        </ButtonRow>
      </Root>
    );
  }
}
